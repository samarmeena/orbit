/*
 * --------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------------------
 */
import api from "@/lib/api";
import { atom } from "jotai";

export const appVersionAtom = atom(async () => {
  return (await api?.invoke("get-version")) as string;
});
