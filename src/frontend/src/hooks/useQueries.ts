import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProductFilter, ProductInput } from "../backend";
import { UserRole } from "../backend";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
import type { ProductWithId } from "../types/product";
import { useActor } from "./useActor";

type UserEntry = { principal: Principal; role: UserRole };

function mapProducts(
  products: import("../backend").Product[],
): ProductWithId[] {
  return products.map((p, i) => ({ ...p, id: BigInt(i) }));
}

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<ProductWithId[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return SAMPLE_PRODUCTS;
      const products = await actor.getAllProducts();
      if (products.length === 0) return SAMPLE_PRODUCTS;
      return mapProducts(products);
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useFilteredProducts(filter: ProductFilter, enabled = true) {
  const { actor, isFetching } = useActor();
  return useQuery<ProductWithId[]>({
    queryKey: ["products", "filtered", filter],
    queryFn: async () => {
      if (!actor) {
        return SAMPLE_PRODUCTS.filter((p) => {
          if (filter.isForWomen && !p.isForWomen) return false;
          if (filter.isForMen && !p.isForMen) return false;
          if (filter.isForKids && !p.isForKids) return false;
          if (
            filter.clothingType &&
            p.clothingType.toLowerCase() !== filter.clothingType.toLowerCase()
          )
            return false;
          if (filter.brand && p.brand !== filter.brand) return false;
          if (filter.minPrice !== undefined && p.price < filter.minPrice)
            return false;
          if (filter.maxPrice !== undefined && p.price > filter.maxPrice)
            return false;
          return true;
        });
      }
      const products = await actor.getFilteredProducts(filter);
      if (products.length === 0 && Object.keys(filter).length === 0)
        return SAMPLE_PRODUCTS;
      return mapProducts(products);
    },
    enabled: !isFetching && enabled,
    staleTime: 30_000,
  });
}

export function useProduct(id: bigint | null) {
  const { actor, isFetching } = useActor();
  const allProducts = useAllProducts();
  return useQuery<ProductWithId | null>({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (id === null) return null;
      if (!actor) {
        return SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
      }
      const p = await actor.getProduct(id);
      if (!p) return allProducts.data?.find((x) => x.id === id) ?? null;
      return { ...p, id };
    },
    enabled: id !== null && !isFetching,
    staleTime: 30_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<UserEntry[]>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      // getAllUsers is present in the backend but not in the local type stub
      return (actor as any).getAllUsers() as Promise<UserEntry[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      principal,
      role,
    }: {
      principal: Principal;
      role: UserRole;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.assignCallerUserRole(principal, role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      if (!actor) throw new Error("No actor");
      await actor.createProduct(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: ProductInput }) => {
      if (!actor) throw new Error("No actor");
      await actor.updateProduct(id, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      await actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export { UserRole };
