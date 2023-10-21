import ExpoModulesCore
import SDWebImage

public class ExpoImageCachePathModule: Module {
    
  public func definition() -> ModuleDefinition {
      
    Name("ExpoImageCachePath")

    Function("getCachePath") { (url: String) -> String? in
      let path:String? = SDImageCache.shared.cachePath(forKey: url)
      
      return path
    }
  }
}
