import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Float "mo:core/Float";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User Management
  public type UserEntry = {
    principal : Principal;
    role : AccessControl.UserRole;
  };

  public query ({ caller }) func getAllUsers() : async [UserEntry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list users");
    };
    accessControlState.userRoles.entries().toArray()
      .map(func((p, r) : (Principal, AccessControl.UserRole)) : UserEntry {
        { principal = p; role = r };
      });
  };

  // Persistent File Reference
  public type FileReference = {
    id : Text;
    file : Storage.ExternalBlob;
    name : Text;
    createdBy : Principal;
    createdAt : Int;
  };

  type FileReferenceInput = {
    id : Text;
    file : Storage.ExternalBlob;
    name : Text;
  };

  let fileReferences = Map.empty<Text, FileReference>();

  public shared ({ caller }) func createFileReference(input : FileReferenceInput) : async FileReference {
    if (input.id.size() == 0) {
      Runtime.trap("File reference ID cannot be empty");
    };
    if (input.name.size() == 0) {
      Runtime.trap("File reference name cannot be empty");
    };

    let fileReference : FileReference = {
      input with
      createdBy = caller;
      createdAt = Time.now();
    };

    fileReferences.add(input.id, fileReference);

    fileReference;
  };

  public shared ({ caller }) func updateFileReference(id : Text, input : FileReferenceInput) : async FileReference {
    if (input.id.size() == 0) {
      Runtime.trap("File reference ID cannot be empty");
    };
    if (input.name.size() == 0) {
      Runtime.trap("File reference name cannot be empty");
    };

    switch (fileReferences.get(id)) {
      case (null) { Runtime.trap("File reference does not exist") };
      case (?existingReference) {
        if (existingReference.createdBy != caller) {
          Runtime.trap("Unauthorized: Only creator can update file reference");
        };
        let fileReference : FileReference = {
          input with
          createdBy = existingReference.createdBy;
          createdAt = existingReference.createdAt;
        };

        fileReferences.add(id, fileReference);

        fileReference;
      };
    };
  };

  public shared ({ caller }) func deleteFileReference(id : Text) : async () {
    switch (fileReferences.get(id)) {
      case (null) { Runtime.trap("File reference does not exist") };
      case (?existingReference) {
        if (existingReference.createdBy != caller) {
          Runtime.trap("Unauthorized: Only creator can delete file reference");
        };
        fileReferences.remove(id);
      };
    };
  };

  public query func getFileReference(id : Text) : async ?FileReference {
    fileReferences.get(id);
  };

  public query func getAllFileReferences() : async [FileReference] {
    fileReferences.values().toArray();
  };

  type Product = {
    name : Text;
    brand : Text;
    price : Float;
    isForMen : Bool;
    isForWomen : Bool;
    isForKids : Bool;
    clothingType : Text;
    sizes : [Text];
    availableColours : [Text];
    imageUrl : Text;
    description : Text;
    stock : Nat;
    createdAt : Int;
  };

  type ProductInput = {
    name : Text;
    brand : Text;
    price : Float;
    isForMen : Bool;
    isForWomen : Bool;
    isForKids : Bool;
    clothingType : Text;
    sizes : [Text];
    availableColours : [Text];
    imageUrl : Text;
    description : Text;
    stock : Nat;
  };

  type ProductFilter = {
    isForMen : ?Bool;
    isForWomen : ?Bool;
    isForKids : ?Bool;
    clothingType : ?Text;
    brand : ?Text;
    minPrice : ?Float;
    maxPrice : ?Float;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;

  func seedProducts() {
    let sampleProducts = [
      {
        name = "Classic White T-Shirt";
        brand = "Calvin Klein";
        price = 19.99;
        isForMen = true;
        isForWomen = false;
        isForKids = false;
        clothingType = "Tops";
        sizes = ["S", "M", "L", "XL"];
        availableColours = ["White"];
        imageUrl = "/images/classic-white-tshirt.jpg";
        description = "Timeless white t-shirt, 100% cotton. Perfect fit for any occasion.";
        stock = 50;
        createdAt = Time.now();
      },
      {
        name = "Slim Fit Jeans";
        brand = "Levi's";
        price = 49.99;
        isForMen = true;
        isForWomen = false;
        isForKids = false;
        clothingType = "Bottoms";
        sizes = ["28", "30", "32", "34", "36"];
        availableColours = ["Blue"];
        imageUrl = "/images/slim-fit-jeans.jpg";
        description = "Classic Levis blue slim fit jeans. Versatile and comfortable.";
        stock = 40;
        createdAt = Time.now();
      },
      {
        name = "Floral Summer Dress";
        brand = "H&M";
        price = 29.99;
        isForMen = false;
        isForWomen = true;
        isForKids = false;
        clothingType = "Dresses";
        sizes = ["XS", "S", "M", "L"];
        availableColours = ["Red", "Yellow", "Blue"];
        imageUrl = "/images/floral-summer-dress.jpg";
        description = "Light and easy floral dress, ideal for summer days. Comes in multiple colours.";
        stock = 30;
        createdAt = Time.now();
      },
      {
        name = "Hooded Puffer Jacket";
        brand = "Moncler";
        price = 199.99;
        isForMen = false;
        isForWomen = true;
        isForKids = false;
        clothingType = "Outerwear";
        sizes = ["S", "M", "L", "XL"];
        availableColours = ["Black", "Navy"];
        imageUrl = "/images/hooded-puffer-jacket.jpg";
        description = "Warm puffer with synthetic filling. Water-resistant and stylish.";
        stock = 25;
        createdAt = Time.now();
      },
      {
        name = "Kids Graphic Tee";
        brand = "Gap Kids";
        price = 12.99;
        isForMen = false;
        isForWomen = false;
        isForKids = true;
        clothingType = "Tops";
        sizes = ["4Y", "6Y", "8Y"];
        availableColours = ["Green", "White", "Blue"];
        imageUrl = "/images/kids-graphic-tee.jpg";
        description = "Fun gap t-shirt with animal graphic for kids. 100% cotton.";
        stock = 60;
        createdAt = Time.now();
      },
      {
        name = "Kid Jogger Pants";
        brand = "Nike Kids";
        price = 24.99;
        isForMen = false;
        isForWomen = false;
        isForKids = true;
        clothingType = "Bottoms";
        sizes = ["3Y", "4Y", "5Y", "6Y"];
        availableColours = ["Grey", "Black"];
        imageUrl = "/images/kids-jogger-pants.jpg";
        description = "Comfortable joggers for playtime. Elastic waistband, soft material.";
        stock = 45;
        createdAt = Time.now();
      },
      {
        name = "Premium Knit Sweater";
        brand = "Ralph Lauren";
        price = 99.99;
        isForMen = true;
        isForWomen = true;
        isForKids = false;
        clothingType = "Tops";
        sizes = ["S", "M", "L"];
        availableColours = ["Brown", "Grey"];
        imageUrl = "/images/premium-knit-sweater.jpg";
        description = "Soft merino wool sweater. Perfect for layering in colder months.";
        stock = 20;
        createdAt = Time.now();
      },
      {
        name = "Women's Workout Leggings";
        brand = "Lululemon";
        price = 39.99;
        isForMen = false;
        isForWomen = true;
        isForKids = false;
        clothingType = "Activewear";
        sizes = ["XS", "S", "M"];
        availableColours = ["Black", "Pink"];
        imageUrl = "/images/womens-workout-leggings.jpg";
        description = "High-stretch leggings made for training and yoga. Sweat-wicking fabric.";
        stock = 35;
        createdAt = Time.now();
      },
      {
        name = "Knit Beanie";
        brand = "Zara";
        price = 16.99;
        isForMen = true;
        isForWomen = true;
        isForKids = false;
        clothingType = "Accessories";
        sizes = ["One Size"];
        availableColours = ["Navy", "Black", "Beige"];
        imageUrl = "/images/knit-beanie.jpg";
        description = "Winter accessory available in multiple colours for men/women. Warm and trendy.";
        stock = 75;
        createdAt = Time.now();
      },
      {
        name = "Kids Winter Parka";
        brand = "Columbia";
        price = 79.99;
        isForMen = false;
        isForWomen = false;
        isForKids = true;
        clothingType = "Outerwear";
        sizes = ["3Y", "4Y", "5Y", "6Y"];
        availableColours = ["Red", "Blue"];
        imageUrl = "/images/kids-winter-parka.jpg";
        description = "Fully insulated waterproof parka for kids. Includes warm lining.";
        stock = 28;
        createdAt = Time.now();
      },
      {
        name = "Men's Classic Polo";
        brand = "Tommy Hilfiger";
        price = 34.99;
        isForMen = true;
        isForWomen = false;
        isForKids = false;
        clothingType = "Tops";
        sizes = ["S", "M", "L", "XL"];
        availableColours = ["Blue", "White"];
        imageUrl = "/images/mens-classic-polo.jpg";
        description = "Iconic Tommy Hilfiger design. Soft cotton polo in casual style.";
        stock = 38;
        createdAt = Time.now();
      },
      {
        name = "Women's Bootcut Jeans";
        brand = "Levi's";
        price = 59.99;
        isForMen = false;
        isForWomen = true;
        isForKids = false;
        clothingType = "Bottoms";
        sizes = ["24", "26", "28", "30"];
        availableColours = ["Black", "Blue"];
        imageUrl = "/images/womens-bootcut-jeans.jpg";
        description = "Flattering Levis bootcut style. Stretch for comfort.";
        stock = 41;
        createdAt = Time.now();
      },
    ];
    for (product in sampleProducts.values()) {
      products.add(nextProductId, product);
      nextProductId += 1;
    };
  };

  seedProducts();

  // Product CRUD Operations
  public shared ({ caller }) func createProduct(newProduct : ProductInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let product : Product = {
      newProduct with
      createdAt = Time.now();
    };
    products.add(nextProductId, product);
    nextProductId += 1;
  };

  public shared ({ caller }) func updateProduct(id : Nat, product : ProductInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (not products.containsKey(id)) { Runtime.trap("Product does not exist.") };
    let updatedProduct : Product = {
      product with
      createdAt = Time.now();
    };
    products.add(id, updatedProduct);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(id)) { Runtime.trap("Product does not exist.") };
    products.remove(id);
  };

  public query func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func getFilteredProducts(filter : ProductFilter) : async [Product] {
    products.values().toArray().filter(
      func(p) {
        switch (filter.isForMen) {
          case (null) { true };
          case (?value) { p.isForMen == value };
        };
      }
    ).filter(
      func(p) {
        switch (filter.isForWomen) {
          case (null) { true };
          case (?value) { p.isForWomen == value };
        };
      }
    ).filter(
      func(p) {
        switch (filter.isForKids) {
          case (null) { true };
          case (?value) { p.isForKids == value };
        };
      }
    ).filter(
      func(p) {
        switch (filter.clothingType) {
          case (null) { true };
          case (?value) { p.clothingType == value };
        };
      }
    ).filter(
      func(p) {
        switch (filter.brand) {
          case (null) { true };
          case (?value) { p.brand == value };
        };
      }
    ).filter(
      func(p) {
        switch (filter.minPrice) {
          case (null) { true };
          case (?value) { p.price >= value };
        };
      }
    ).filter(
      func(p) {
        switch (filter.maxPrice) {
          case (null) { true };
          case (?value) { p.price <= value };
        };
      }
    ).sort();
  };
};
