import { createTRPCClient } from "@trpc/client";
import * as sq from "@adeora/solid-query";

import type {
  inferProcedureOutput,
  inferProcedureInput,
  TRPCError,
} from "@trpc/server";
import type { Router } from "@memedows/api";

import { supabase } from "./supabase";
import {
  CreateQueryOptions,
  CreateQueryResult,
} from "@adeora/solid-query/dist/types";

export const trpcClient = createTRPCClient<Router>({
  url: "/api/trpc",
  headers() {
    return {
      authorization: supabase.auth.session()?.access_token,
    };
  },
});

type AppQueries = Router["_def"]["queries"];
type AppQueryKeys = keyof AppQueries;

export type InferQueryInput<TRouteKey extends keyof AppQueries> =
  inferProcedureInput<AppQueries[TRouteKey]>;

export type InferQueryOutput<TRouteKey extends keyof AppQueries> =
  inferProcedureOutput<AppQueries[TRouteKey]>;

type CreateQueryPath<TPath extends AppQueryKeys> =
  InferQueryInput<TPath> extends void
    ? [TPath, InferQueryInput<TPath> | (() => InferQueryInput<TPath>)]
    : [TPath];

export const createQuery = <TPath extends AppQueryKeys>(
  path: CreateQueryPath<TPath>,
  options?: CreateQueryOptions
): CreateQueryResult<InferQueryOutput<TPath>, TRPCError> => {
  return sq.createQuery(
    () => path,
    ({ queryKey }) => {
      // @ts-ignore
      return trpcClient.query(queryKey[0], queryKey[1]);
    },
    options as any
  );
};
