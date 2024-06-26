/*
 * --------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------------------
 */
import ServerInfoDialog from "../dialogs/server-info";
import { DefaultGroupKey, groupIndexAtom } from "@/atoms/group";
import {
  GroupActionType,
  groupsAtom,
  groupsAtomReducer,
} from "@/atoms/group/groups";
import { GTAFolderAtom } from "@/atoms/gta-folder";
import {
  FavoritesServerActionType,
  serverFavoritesAtom,
  serverFavoritesAtomReducer,
} from "@/atoms/server/favorites";
import { usernameAtom } from "@/atoms/username";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { connectServer } from "@/lib/samp";
import { ServerInfo } from "@/types/server-info";
import { useAtomValue } from "jotai";
import { useReducerAtom } from "jotai/utils";
import React from "react";
import { toast } from "sonner";

export default function ServerContextMenu({
  children,
  server,
  serverIndex,
}: {
  children: React.ReactNode;
  server: ServerInfo;
  serverIndex: number;
}) {
  const gta_folder = useAtomValue(GTAFolderAtom);
  const username = useAtomValue(usernameAtom);
  const groupIndex = useAtomValue(groupIndexAtom);
  const isFavorites = groupIndex === DefaultGroupKey.Favorites;
  const isHosted = groupIndex === DefaultGroupKey.Hosted;

  const clickCountRef = React.useRef(0);

  const handleClick = () => {
    // Increment click count
    clickCountRef.current++;

    // Check if it's a double click
    if (clickCountRef.current === 2) {
      // It's a double click
      setInfoDialog(true);

      // Reset click count
      clickCountRef.current = 0;
    }

    // Reset click count
    setTimeout(() => {
      clickCountRef.current = 0;
    }, 500);
  };

  const [, groupsDispatch] = useReducerAtom(groupsAtom, groupsAtomReducer);
  const [, favoritesDispatch] = useReducerAtom(
    serverFavoritesAtom,
    serverFavoritesAtomReducer,
  );

  const [infoDialog, setInfoDialog] = React.useState(false);

  const handleConnect = () => {
    void connectServer({
      gta_folder,
      username,
      server,
    });
    toast.success(`Connecting to ${server.hostname ?? server.address}`);
  };

  const handleCopyServerAddress = () => {
    void navigator.clipboard.writeText(server.address);
    toast.success("Server address copied to clipboard");
  };

  const handleAddToFavorites = () => {
    favoritesDispatch({
      address: server.address,
      type: FavoritesServerActionType.ADD,
    });
    toast.success(`Added ${server.hostname ?? server.address} to favorites`);
  };

  const handleDelete = () => {
    if (isFavorites) {
      favoritesDispatch({
        serverId: serverIndex,
        type: FavoritesServerActionType.REMOVE,
      });
    } else {
      groupsDispatch({
        groupId: groupIndex,
        serverId: serverIndex,
        type: GroupActionType.REMOVE_SERVER,
      });
    }

    toast.success(`Deleted ${server.hostname ?? server.address}`);
  };

  return (
    <>
      <ServerInfoDialog
        open={infoDialog}
        onOpenChange={setInfoDialog}
        server={server}
      />
      <ContextMenu>
        <ContextMenuTrigger onClick={handleClick} asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleConnect}>Connect</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            disabled={isFavorites}
            onClick={handleAddToFavorites}
          >
            Add to favorites
          </ContextMenuItem>
          <ContextMenuItem disabled={isHosted} onClick={handleDelete}>
            Delete server
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleCopyServerAddress}>
            Copy server address
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              setInfoDialog(true);
            }}
          >
            Server properties
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
