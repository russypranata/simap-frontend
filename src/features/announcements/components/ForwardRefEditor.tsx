"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";

const Editor = dynamic(
  () =>
    import("./InitializedMDXEditor").then((mod) => mod.InitializedMDXEditor),
  { ssr: false }
);

export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <Editor {...props} ref={ref} />
);

ForwardRefEditor.displayName = "ForwardRefEditor";
