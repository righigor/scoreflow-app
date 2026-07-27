import type { FederacaoType } from "./federacao-type";


export interface FederacaoContextType {
  federacao: FederacaoType | undefined;
  isPending: boolean;
  error: Error | null;
}