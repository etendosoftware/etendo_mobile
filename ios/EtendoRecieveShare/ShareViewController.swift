import UIKit
import Social
import MobileCoreServices
import Photos

class ShareViewController: UIViewController {
    var token: String?
    var urlToFetchSubApps: String?
    
    var subApplicationsData = [[String: Any]]()
    var rawResponse: String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let appGroupID = "group.com.etendoapploader.ios"
        let sharedDefaults = UserDefaults(suiteName: appGroupID)
        
        token = sharedDefaults?.string(forKey: "token")
        urlToFetchSubApps = sharedDefaults?.string(forKey: "urlToFetchSubApps")
        
        if let extensionItems = extensionContext?.inputItems as? [NSExtensionItem] {
            for item in extensionItems {
                if let attachments = item.attachments {
                    for attachment in attachments {
                        if attachment.hasItemConformingToTypeIdentifier(kUTTypeImage as String) ||
                           attachment.hasItemConformingToTypeIdentifier(kUTTypeMovie as String) ||
                           attachment.hasItemConformingToTypeIdentifier(kUTTypeAudio as String) ||
                           attachment.hasItemConformingToTypeIdentifier(kUTTypeData as String) {
                            
                            if let uti = attachment.registeredTypeIdentifiers.first {
                                attachment.loadItem(forTypeIdentifier: uti, options: nil) { [weak self] (data, error) in
                                    guard let self = self else { return }
                                    if let url = data as? URL {
                                        self.saveFileToAppGroup(fileURL: url)
                                    } else if let image = data as? UIImage {
                                        self.saveImageToAppGroup(image: image)
                                    } else {
                                        print("Unsupported data type")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        if let token = self.token, let urlToFetchSubApps = self.urlToFetchSubApps {
            fetchSubApplications { [weak self] success in
                guard let self = self else { return }
                
                DispatchQueue.main.async {
                    if success {
                        self.showShareModal()
                    } else {
                        self.showErrorAlert(message: "Could not retrieve the sub-applications.", token: self.token, urlToFetchSubApps: self.urlToFetchSubApps)
                    }
                }
            }
        } else {
            self.showErrorAlert(message: "Please log in to the main application before using this feature.", token: self.token, urlToFetchSubApps: self.urlToFetchSubApps)
        }
    }

    private func saveFileToAppGroup(fileURL: URL) {
        let appGroupID = "group.com.etendoapploader.ios"
        let fileManager = FileManager.default

        if let containerURL = fileManager.containerURL(forSecurityApplicationGroupIdentifier: appGroupID) {
            let destinationURL = containerURL.appendingPathComponent(fileURL.lastPathComponent)

            do {
                if fileManager.fileExists(atPath: destinationURL.path) {
                    try fileManager.removeItem(at: destinationURL)
                }
                try fileManager.copyItem(at: fileURL, to: destinationURL)

                let fileData = try Data(contentsOf: destinationURL)
                var fileBase64String: String?
                
                if fileData.count < 1_000_000 {
                    fileBase64String = fileData.base64EncodedString(options: .lineLength64Characters)
                } else {
                    print("The file is too large to encode in base64.")
                }
                
                let sharedDefaults = UserDefaults(suiteName: appGroupID)
                sharedDefaults?.set(destinationURL.path, forKey: "sharedFilePath")
                if let base64String = fileBase64String {
                    sharedDefaults?.set(base64String, forKey: "sharedFileBase64")
                }
                sharedDefaults?.set(fileURL.lastPathComponent, forKey: "sharedFileName")
                sharedDefaults?.set(getMimeType(for: fileURL), forKey: "sharedFileMimeType")
                sharedDefaults?.synchronize()
            } catch {
                print("Error processing the file:: \(error)")
            }
        }
    }

    private func saveImageToAppGroup(image: UIImage) {
        let appGroupID = "group.com.etendoapploader.ios"
        let fileManager = FileManager.default

        if let containerURL = fileManager.containerURL(forSecurityApplicationGroupIdentifier: appGroupID) {
            let imageName = "shared_image.jpg"
            let destinationURL = containerURL.appendingPathComponent(imageName)

            do {
                if fileManager.fileExists(atPath: destinationURL.path) {
                    try fileManager.removeItem(at: destinationURL)
                }
                if let imageData = image.jpegData(compressionQuality: 1.0) {
                    try imageData.write(to: destinationURL)
                    var imageBase64String: String?
                    if imageData.count < 1_000_000 {
                        imageBase64String = imageData.base64EncodedString(options: .lineLength64Characters)
                    }

                    let sharedDefaults = UserDefaults(suiteName: appGroupID)
                    sharedDefaults?.set(destinationURL.path, forKey: "sharedFilePath")
                    if let base64String = imageBase64String {
                        sharedDefaults?.set(base64String, forKey: "sharedFileBase64")
                    }
                    sharedDefaults?.set(imageName, forKey: "sharedFileName")
                    sharedDefaults?.set("image/jpeg", forKey: "sharedFileMimeType")
                    sharedDefaults?.synchronize()
                }
            } catch {
                print("Error processing the file: \(error)")
            }
        }
    }

    private func getMimeType(for url: URL) -> String {
        let pathExtension = url.pathExtension as CFString
        if let uti = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, pathExtension, nil)?.takeRetainedValue(),
           let mimeType = UTTypeCopyPreferredTagWithClass(uti, kUTTagClassMIMEType)?.takeRetainedValue() {
            return mimeType as String
        }
        return "application/octet-stream"
    }

    private func fetchSubApplications(completion: @escaping (Bool) -> Void) {
        guard let urlString = self.urlToFetchSubApps,
              let token = self.token else {
            print("URL o token inválidos")
            completion(false)
            return
        }
        
        let urlStringWithPath = "\(urlString)/sws/com.etendoerp.dynamic.app.userApp"
        
        guard let url = URL(string: urlStringWithPath) else {
            completion(false)
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let sessionConfig = URLSessionConfiguration.default
        sessionConfig.requestCachePolicy = .reloadIgnoringLocalCacheData
        let session = URLSession(configuration: sessionConfig)
        
        let task = session.dataTask(with: request) { [weak self] data, response, error in
            if let error = error {
                completion(false)
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse {
                if httpResponse.statusCode == 401 {
                    self?.showErrorAlert(message: "Invalid or expired token. Please log in again.", token: self?.token, urlToFetchSubApps: self?.urlToFetchSubApps)
                    completion(false)
                    return
                } else if httpResponse.statusCode != 200 {
                    self?.rawResponse = String(data: data ?? Data(), encoding: .utf8)
                    completion(false)
                    return
                }
            }
            
            guard let data = data else {
                completion(false)
                return
            }
            
            do {
                let jsonObject = try JSONSerialization.jsonObject(with: data, options: [])
                
                if let jsonArray = jsonObject as? [[String: Any]] {
                    self?.subApplicationsData = jsonArray
                    completion(true)
                } else if let jsonDict = jsonObject as? [String: Any] {
                    if let dataArray = jsonDict["data"] as? [[String: Any]] {
                        self?.subApplicationsData = dataArray
                        completion(true)
                    } else {
                        self?.rawResponse = String(data: data, encoding: .utf8)
                        completion(false)
                    }
                } else {
                    self?.rawResponse = String(data: data, encoding: .utf8)
                    completion(false)
                }
            } catch {
                self?.rawResponse = String(data: data, encoding: .utf8)
                completion(false)
            }
        }
        
        task.resume()
    }

    private func showShareModal() {
        let alertController = UIAlertController(title: "Select Sub-application", message: "Choose where to share", preferredStyle: .actionSheet)

        let sharedDefaults = UserDefaults(suiteName: "group.com.etendoapploader.ios")
        let fileName = sharedDefaults?.string(forKey: "sharedFileName") ?? "No disponible"
        let filePath = sharedDefaults?.string(forKey: "sharedFilePath") ?? "No disponible"
        let fileBase64 = sharedDefaults?.string(forKey: "sharedFileBase64") ?? "No hay contenido"
        let fileMimeType = sharedDefaults?.string(forKey: "sharedFileMimeType") ?? "application/octet-stream"
        
        if !subApplicationsData.isEmpty {
            for subApp in subApplicationsData {
                let appName = subApp["etdappAppName"] as? String ?? "Unknown App"
                let pathName = subApp["path"] as? String ?? "Unknown Path"
                
                let action = UIAlertAction(title: appName, style: .default) { _ in
                    self.handleShare(with: appName, path: pathName)
                }
                alertController.addAction(action)
            }
        } else if let rawResponse = rawResponse {
            let rawAction = UIAlertAction(title: "Show Raw JSON Response", style: .default) { _ in
                self.showRawJSONAlert()
            }
            alertController.addAction(rawAction)
        } else {
            let noDataAction = UIAlertAction(title: "No Sub-applications Found", style: .default) { _ in
                self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
            }
            alertController.addAction(noDataAction)
        }
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { _ in
            self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
        }
        alertController.addAction(cancelAction)

        present(alertController, animated: true, completion: nil)
    }

    private func handleShare(with subApplication: String, path: String) {
        let appGroupID = "group.com.etendoapploader.ios"
        let sharedDefaults = UserDefaults(suiteName: appGroupID)

        guard let filePath = sharedDefaults?.string(forKey: "sharedFilePath"),
              let fileName = sharedDefaults?.string(forKey: "sharedFileName"),
              let fileMimeType = sharedDefaults?.string(forKey: "sharedFileMimeType"),
              !filePath.isEmpty, !fileName.isEmpty, !fileMimeType.isEmpty else {
            let alertController = UIAlertController(title: "Incomplete Data", message: "The attachment data is not fully configured.", preferredStyle: .alert)
            let dismissAction = UIAlertAction(title: "OK", style: .default, handler: nil)
            alertController.addAction(dismissAction)
            self.present(alertController, animated: true, completion: nil)
            return
        }
        
        sharedDefaults?.set(subApplication, forKey: "selectedSubApplication")
        sharedDefaults?.set(path, forKey: "selectedPath")
        sharedDefaults?.synchronize()

        let subApplicationEncoded = subApplication.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? subApplication
        let pathEncoded = path.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? path

        let urlString = "ShareMedia://open?subApplication=\(subApplicationEncoded)&path=\(pathEncoded)"
        if let url = URL(string: urlString) {
            var responder = self as UIResponder?
            let selectorOpenURL = sel_registerName("openURL:")

            while let r = responder {
                if r.responds(to: selectorOpenURL) {
                    _ = r.perform(selectorOpenURL, with: url)
                    break
                }
                responder = r.next
            }
        }

        self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
    }

    private func showRawJSONAlert() {
        let alertController = UIAlertController(title: "Raw JSON Response", message: rawResponse, preferredStyle: .alert)
        let dismissAction = UIAlertAction(title: "OK", style: .default) { _ in
            self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
        }
        alertController.addAction(dismissAction)
        
        present(alertController, animated: true, completion: nil)
    }
    
    private func showErrorAlert(message: String, token: String?, urlToFetchSubApps: String?) {
        DispatchQueue.main.async {
            let fullMessage = "\(message)"
            
            let alertController = UIAlertController(title: "Error", message: fullMessage, preferredStyle: .alert)
            let dismissAction = UIAlertAction(title: "OK", style: .default) { _ in
                self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
            }
            alertController.addAction(dismissAction)
            self.present(alertController, animated: true, completion: nil)
        }
    }
}
