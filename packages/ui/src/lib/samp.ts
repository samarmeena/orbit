"use client";

/*
 * --------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------------------
 */
import api from "./api";
import { Alert } from "./dialog";
import { launchSamp } from "./electron";
import { DefaultGtaFolder } from "@/atoms/gta-folder";
import { ServerInfo } from "@/types/server-info";

export const connectServer = async (
  server: ServerInfo,
  { password, rconPassword }: { password?: string; rconPassword?: string } = {
    password: undefined,
    rconPassword: undefined,
  },
) => {
  try {
    const folder = localStorage.getItem("gta-folder") ?? DefaultGtaFolder;
    const username = localStorage.getItem("username")?.replaceAll('"', "");

    if (!folder || folder.length === 0) {
      throw new Error("Please select gta folder in settings.");
    }

    if (!username || username.length === 0) {
      throw new Error("Please set your username.");
    }

    const gta_sa = `${folder}\\gta_sa.exe`;
    const samp = `${folder}\\samp.exe`;

    const isGtaSaExist = await api?.invoke("path-exist", gta_sa);
    const isSampExist = await api?.invoke("path-exist", samp);

    if (!isGtaSaExist) {
      throw new Error("GTA_SA.EXE not found in the selected folder.");
    }

    if (!isSampExist) {
      throw new Error("SAMP.EXE not found in the selected folder.");
    }

    await launchSamp({
      address: server.address,
      username,
      gta_sa,
      samp,
      password,
      rconPassword,
    });
  } catch (error) {
    console.error("Error occurred during folder selection:", error);
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error && error.message) {
      errorMessage = error.message;
    }

    void Alert({
      title: "Error",
      description: errorMessage,
      showCancel: false,
    });
  }
};
