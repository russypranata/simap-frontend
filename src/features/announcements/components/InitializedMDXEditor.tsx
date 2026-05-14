"use client";

import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  linkPlugin,
  linkDialogPlugin,
  CreateLink,
  UndoRedo,
  Separator,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import { forwardRef } from "react";

export const InitializedMDXEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => (
    <MDXEditor
      ref={ref}
      {...props}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BlockTypeSelect />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <CreateLink />
            </>
          ),
        }),
      ]}
    />
  )
);

InitializedMDXEditor.displayName = "InitializedMDXEditor";
