import UIKit
import Capacitor
import GameKit

// アプリの画面。Capacitor の画面に、このアプリだけの部品（Game Center）を登録する。
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(GameCenterPlugin())
    }
}

// Game Center（世界ランキング）。js/gamecenter.js から使う。
// ・signIn：Game Center にサインイン（していなければ Apple のサインイン画面を出す）
// ・submitScore：スコアを送る（サインインしていなければ何もしない）
// ・showLeaderboard：Apple のランキング画面を開く
@objc(GameCenterPlugin)
public class GameCenterPlugin: CAPPlugin, CAPBridgedPlugin, GKGameCenterControllerDelegate {
    public let identifier = "GameCenterPlugin"
    public let jsName = "GameCenter"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "signIn", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "submitScore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showLeaderboard", returnType: CAPPluginReturnPromise),
    ]

    private var pendingSignIn: [CAPPluginCall] = []
    private var handlerSet = false

    @objc func signIn(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let player = GKLocalPlayer.local
            if player.isAuthenticated { call.resolve(["signedIn": true]); return }
            self.pendingSignIn.append(call)
            if self.handlerSet { return }
            self.handlerSet = true
            // Apple の決まりで、この関数はアプリの起動中に何度も呼ばれることがある
            player.authenticateHandler = { [weak self] vc, _ in
                guard let self = self else { return }
                if let vc = vc {
                    self.bridge?.viewController?.present(vc, animated: true)
                    return
                }
                let signedIn = GKLocalPlayer.local.isAuthenticated
                let calls = self.pendingSignIn
                self.pendingSignIn = []
                calls.forEach { $0.resolve(["signedIn": signedIn]) }
                self.notifyListeners("signInChange", data: ["signedIn": signedIn])
            }
        }
    }

    @objc func submitScore(_ call: CAPPluginCall) {
        guard let id = call.getString("leaderboardId"), let score = call.getInt("score") else {
            call.reject("leaderboardId と score が必要です"); return
        }
        guard GKLocalPlayer.local.isAuthenticated else { call.resolve(["sent": false]); return }
        GKLeaderboard.submitScore(score, context: 0, player: GKLocalPlayer.local, leaderboardIDs: [id]) { error in
            if let error = error { call.reject(error.localizedDescription) } else { call.resolve(["sent": true]) }
        }
    }

    @objc func showLeaderboard(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard GKLocalPlayer.local.isAuthenticated else { call.reject("notSignedIn"); return }
            let vc: GKGameCenterViewController
            if let id = call.getString("leaderboardId") {
                vc = GKGameCenterViewController(leaderboardID: id, playerScope: .global, timeScope: .allTime)
            } else {
                vc = GKGameCenterViewController(state: .leaderboards)
            }
            vc.gameCenterDelegate = self
            self.bridge?.viewController?.present(vc, animated: true)
            call.resolve()
        }
    }

    public func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
        gameCenterViewController.dismiss(animated: true)
    }
}
