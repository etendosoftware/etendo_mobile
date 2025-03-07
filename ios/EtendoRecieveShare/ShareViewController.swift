import UIKit
import Photos
import UniformTypeIdentifiers
import AVFoundation

/**
 * ShareViewController handles the sharing extension functionality
 * Responsible for receiving shared content from other apps and routing it to appropriate sub-applications
 */
@available(iOSApplicationExtension, unavailable)
class ShareViewController: UIViewController {
  // MARK: - Properties
  
  /// Authentication token for API requests
  var token: String?
  
  /// Base URL for fetching sub-applications
  var urlToFetchSubApps: String?
  
  /// Array holding the sub-applications data received from API
  var subApplicationsData = [[String: Any]]()
  
  /// Raw JSON response for debugging purposes
  var rawResponse: String?
  
  // MARK: - App Group Configuration
  
  /// Main application bundle identifier
  let hostAppBundleIdentifier = "com.etendoapploader.ios"
  
  /// Custom URL scheme for inter-app communication
  let shareProtocol = "ShareMedia"
  
  /// Key used to store shared media in UserDefaults
  let sharedKey = "ShareKey"
  
  /// Collection of media files being shared
  var sharedMedia: [SharedMediaFile] = []
  
  /// Collection of text content being shared
  var sharedText: [String] = []
  
  // MARK: - Lifecycle Methods
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    // Configure UserDefaults for the app group
    let appGroupID = "group.\(hostAppBundleIdentifier)"
    let sharedDefaults = UserDefaults(suiteName: appGroupID)
    
    // Load token and URL from UserDefaults
    token = sharedDefaults?.string(forKey: "token")
    urlToFetchSubApps = sharedDefaults?.string(forKey: "urlToFetchSubApps")
    
    if let extensionItems = extensionContext?.inputItems as? [NSExtensionItem] {
      for item in extensionItems {
        if let attachments = item.attachments {
          for attachment in attachments {
            print("Attachment type identifiers:", attachment.registeredTypeIdentifiers)
            
            if attachment.hasItemConformingToTypeIdentifier(UTType.image.identifier) {
              handleImages(attachment: attachment)
            } else {
              handleGenericFile(attachment: attachment)
            }
          }
        }
      }
    }
    
    // Validate token and URL for fetching sub-applications
    if let _ = self.token, let _ = self.urlToFetchSubApps {
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
      showErrorAlert(message: "Please log in to the main application before using this feature.", token: token, urlToFetchSubApps: urlToFetchSubApps)
    }
  }
  
  // MARK: - Media Type Handling
  
  /**
   * Handles image attachments from the share extension
   * @param attachment The NSItemProvider containing the image data
   */
  private func handleImages(attachment: NSItemProvider) {
    attachment.loadItem(forTypeIdentifier: UTType.image.identifier, options: nil) { [weak self] data, error in
      guard let self = self else { return }
      if let url = data as? URL {
        self.processMediaFile(url: url, type: SharedMediaType.image)
      } else if let error = error {
        print("Error loading image: \(error)")
      }
    }
  }
  
  /**
   * Handles any generic file attachment from the share extension
   * @param attachment The NSItemProvider containing the file data
   */
  private func handleGenericFile(attachment: NSItemProvider) {
    attachment.loadItem(forTypeIdentifier: UTType.data.identifier, options: nil) { [weak self] data, error in
      guard let self = self else { return }
      if let url = data as? URL {
        self.processMediaFile(url: url, type: SharedMediaType.file)
      } else if let error = error {
        print("Error loading generic file: \(error)")
      } else {
        print("Neither URL nor error received for generic file")
      }
    }
  }
  
  // MARK: - File Processing
  
  /**
   * Determines the MIME type dynamically based on the file's UTI or extension
   * @param url The file URL to evaluate
   * @return String representing the corresponding MIME type
   */
  private func getMimeType(from url: URL) -> String {
    if let uti = try? url.resourceValues(forKeys: [.typeIdentifierKey]).typeIdentifier,
       let mimeType = UTType(uti)?.preferredMIMEType {
      return mimeType
    }
    let fileExtension = url.pathExtension.lowercased()
    if !fileExtension.isEmpty,
       let uti = UTType(filenameExtension: fileExtension),
       let mimeType = uti.preferredMIMEType {
      return mimeType
    }
    return "application/octet-stream"
  }
  
  /**
   * Processes a media file received from the share extension
   * Copies the file to the app group container with a unique name
   * @param url Location of the original file
   * @param type The type of media being processed
   */
  private func processMediaFile(url: URL, type: SharedMediaType) {
    let fileExtension = getExtension(from: url, type: type)
    let mimeType = getMimeType(from: url)
    print("Processing file: \(url), type: \(type), extension: \(fileExtension), mime: \(mimeType)")
    let newName = UUID().uuidString
    let newPath = FileManager.default
      .containerURL(forSecurityApplicationGroupIdentifier: "group.\(hostAppBundleIdentifier)")!
      .appendingPathComponent("\(newName).\(fileExtension)")
    print("Will copy to: \(newPath)")
    let copied = copyFile(at: url, to: newPath)
    if copied {
      print("Successfully copied file to \(newPath)")
      sharedMedia.append(SharedMediaFile(path: newPath.absoluteString, thumbnail: nil, duration: nil, type: type))
    } else {
      print("Failed to copy file from \(url) to \(newPath)")
    }
  }
  
  /**
   * Extracts the file extension from a URL
   * @param url The URL to extract extension from
   * @param type The media type for default extension fallback
   * @return String representing the file extension
   */
  private func getExtension(from url: URL, type: SharedMediaType) -> String {
    let parts = url.lastPathComponent.components(separatedBy: ".")
    var ex: String? = nil
    if parts.count > 1 {
      ex = parts.last?.lowercased()
    }
    if ex == nil || ex!.isEmpty {
      switch type {
      case .image:
        ex = "jpg"
      case .file:
        if let uti = try? url.resourceValues(forKeys: [.typeIdentifierKey]).typeIdentifier,
           let preferredExtension = UTType(uti)?.preferredFilenameExtension {
          ex = preferredExtension
        } else {
          ex = "bin"
        }
      default:
        ex = "bin"
      }
    }
    print("Extension detected: \(ex ?? "unknown")")
    return ex ?? "bin"
  }
  
  /**
   * Copies a file from source to destination URL
   * @param srcURL Source file location
   * @param dstURL Destination file location
   * @return Boolean indicating success or failure
   */
  private func copyFile(at srcURL: URL, to dstURL: URL) -> Bool {
    do {
      if FileManager.default.fileExists(atPath: dstURL.path) {
        try FileManager.default.removeItem(at: dstURL)
      }
      try FileManager.default.copyItem(at: srcURL, to: dstURL)
      return true
    } catch {
      print("Error copying file: \(error)")
      return false
    }
  }
  
  // MARK: - API Communication
  
  /**
   * Fetches available sub-applications from the server
   * @param completion Closure called upon completion with success indicator
   */
  private func fetchSubApplications(completion: @escaping (Bool) -> Void) {
    guard let urlString = urlToFetchSubApps, let token = token,
          let url = URL(string: "\(urlString)/sws/com.etendoerp.dynamic.app.userApp") else {
      print("Invalid URL or token")
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
      guard let self = self else { return }
      if let error = error {
        print("Request error: \(error)")
        completion(false)
        return
      }
      
      if let httpResponse = response as? HTTPURLResponse {
        if httpResponse.statusCode == 401 {
          self.showErrorAlert(message: "Invalid or expired token. Please log in again.", token: token, urlToFetchSubApps: urlString)
          completion(false)
          return
        } else if httpResponse.statusCode != 200 {
          self.rawResponse = String(data: data ?? Data(), encoding: .utf8)
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
          self.subApplicationsData = jsonArray
          completion(true)
        } else if let jsonDict = jsonObject as? [String: Any], let dataArray = jsonDict["data"] as? [[String: Any]] {
          self.subApplicationsData = dataArray
          completion(true)
        } else {
          self.rawResponse = String(data: data, encoding: .utf8)
          completion(false)
        }
      } catch {
        self.rawResponse = String(data: data, encoding: .utf8)
        completion(false)
      }
    }
    task.resume()
  }
  
  // MARK: - User Interface
  
  /**
   * Displays a modal allowing the user to select a sub-application to share content with
   */
  private func showShareModal() {
      let alertController = UIAlertController(title: "Select Sub-application", message: "Choose where to share", preferredStyle: .actionSheet)
      
      if !subApplicationsData.isEmpty {
          let filteredApps = subApplicationsData.filter { $0["etdappShareEnabled"] as? Bool == true }
          
          if !filteredApps.isEmpty {
              for subApp in filteredApps {
                  let appName = subApp["etdappAppName"] as? String ?? "Unknown App"
                  let pathName = subApp["path"] as? String ?? "Unknown Path"
                  
                  let action = UIAlertAction(title: appName, style: .default) { _ in
                      self.handleShare(with: appName, path: pathName)
                  }
                  alertController.addAction(action)
              }
          } else {
              let noDataAction = UIAlertAction(title: "No Share-Enabled Sub-applications Found", style: .default) { _ in
                  self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
              }
              alertController.addAction(noDataAction)
          }
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
      
      if let popoverController = alertController.popoverPresentationController {
          popoverController.sourceView = self.view
          popoverController.sourceRect = CGRect(x: self.view.bounds.midX, y: self.view.bounds.midY, width: 0, height: 0)
          popoverController.permittedArrowDirections = []
      }
      
      present(alertController, animated: true, completion: nil)
  }

  /**
   * Handles the sharing process with the selected sub-application
   * @param subApplication The name of the selected sub-application
   * @param path The path identifier of the selected sub-application
   */
  private func handleShare(with subApplication: String, path: String) {
    print("Starting handleShare with app: \(subApplication), path: \(path)")
    print("sharedMedia contents: \(sharedMedia)")
    let appGroupID = "group.\(hostAppBundleIdentifier)"
    let sharedDefaults = UserDefaults(suiteName: appGroupID)
    
    // Save shared data in UserDefaults
    if let encodedMedia = toData(data: sharedMedia) {
      print("Successfully encoded sharedMedia with \(sharedMedia.count) items")
      sharedDefaults?.set(encodedMedia, forKey: sharedKey)
    } else {
      print("Error encoding sharedMedia with \(sharedMedia.count) items")
      sharedDefaults?.set(Data(), forKey: sharedKey) // Default value
    }
    
    sharedDefaults?.set(sharedText, forKey: "sharedText")
    sharedDefaults?.set(subApplication, forKey: "selectedSubApplication")
    sharedDefaults?.set(path, forKey: "selectedPath")
    sharedDefaults?.synchronize()
    
    // Build redirection URL
    let type = "file"
    let subApplicationEncoded = subApplication.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? subApplication
    let pathEncoded = path.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? path
    let urlString = "\(shareProtocol)://dataUrl=\(sharedKey)?subApplication=\(subApplicationEncoded)&path=\(pathEncoded)#\(type)"
    print("Opening URL: \(urlString)")
    
    if let url = URL(string: urlString) {
      UIApplication.shared.open(url, options: [:]) { success in
        print("Extension completed")
        self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
      }
    } else {
      print("Invalid URL: \(urlString)")
      self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
    }
  }
  
  /**
   * Displays the raw JSON response for debugging purposes
   */
  private func showRawJSONAlert() {
    let alertController = UIAlertController(title: "Raw JSON Response", message: rawResponse, preferredStyle: .alert)
    let dismissAction = UIAlertAction(title: "OK", style: .default) { _ in
      self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
    }
    alertController.addAction(dismissAction)
    present(alertController, animated: true, completion: nil)
  }
  
  /**
   * Displays an error alert to the user
   * @param message The error message to display
   * @param token The current token value (for debugging)
   * @param urlToFetchSubApps The current URL value (for debugging)
   */
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

// MARK: - Support Structures

/**
 * Represents a media file that is being shared through the extension
 */
class SharedMediaFile: Codable {
  /// The file path in the app group container
  var path: String
  
  /// Optional thumbnail path for video files
  var thumbnail: String?
  
  /// Optional duration in milliseconds for video files
  var duration: Double?
  
  /// The type of media being shared
  var type: SharedMediaType
  
  init(path: String, thumbnail: String?, duration: Double?, type: SharedMediaType) {
    self.path = path
    self.thumbnail = thumbnail
    self.duration = duration
    self.type = type
  }
}

/**
 * Enumeration of supported media types for sharing
 */
enum SharedMediaType: Int, Codable {
  case image
  case video
  case file
}

/**
 * Converts an array of SharedMediaFile objects to Data for storage
 * @param data Array of SharedMediaFile objects to encode
 * @return Data representation of the array, or nil if encoding fails
 */
func toData(data: [SharedMediaFile]) -> Data? {
  return try? JSONEncoder().encode(data)
}
