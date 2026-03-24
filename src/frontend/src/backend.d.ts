import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ProductInput {
    isForWomen: boolean;
    name: string;
    isForMen: boolean;
    description: string;
    sizes: Array<string>;
    stock: bigint;
    imageUrl: string;
    clothingType: string;
    brand: string;
    price: number;
    isForKids: boolean;
    availableColours: Array<string>;
}
export interface Product {
    isForWomen: boolean;
    name: string;
    createdAt: bigint;
    isForMen: boolean;
    description: string;
    sizes: Array<string>;
    stock: bigint;
    imageUrl: string;
    clothingType: string;
    brand: string;
    price: number;
    isForKids: boolean;
    availableColours: Array<string>;
}
export interface FileReferenceInput {
    id: string;
    file: ExternalBlob;
    name: string;
}
export interface FileReference {
    id: string;
    file: ExternalBlob;
    name: string;
    createdAt: bigint;
    createdBy: Principal;
}
export interface UserProfile {
    name: string;
}
export interface ProductFilter {
    isForWomen?: boolean;
    isForMen?: boolean;
    maxPrice?: number;
    clothingType?: string;
    brand?: string;
    minPrice?: number;
    isForKids?: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createFileReference(input: FileReferenceInput): Promise<FileReference>;
    createProduct(newProduct: ProductInput): Promise<void>;
    deleteFileReference(id: string): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllFileReferences(): Promise<Array<FileReference>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllUsers(): Promise<Array<{ principal: Principal; role: UserRole }>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFileReference(id: string): Promise<FileReference | null>;
    getFilteredProducts(filter: ProductFilter): Promise<Array<Product>>;
    getProduct(id: bigint): Promise<Product | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateFileReference(id: string, input: FileReferenceInput): Promise<FileReference>;
    updateProduct(id: bigint, product: ProductInput): Promise<void>;
}
