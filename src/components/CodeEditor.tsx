import { useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { ViewUpdate } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { marked } from "marked";
import { vim } from "@replit/codemirror-vim";
import "./CodeEditor.css";

export default function CodeEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [previewContent, setPreviewContent] = useState<string>("");
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const updateListener = EditorView.updateListener.of(
        (update: ViewUpdate) => {
          if (update.docChanged || update.selectionSet) {
            const doc = update.state.doc.toString();
            setPreviewContent(marked.parse(doc) as string);
          }
        },
      );

      const state = EditorState.create({
        doc: "# Start writing Markdown here\n",
        extensions: [basicSetup, markdown(), oneDark, updateListener, vim()],
      });

      const view = new EditorView({
        state,
        parent: editorRef.current,
      });

      viewRef.current = view;

      // Set initial preview content
      setPreviewContent(marked.parse(state.doc.toString()) as string);

      return () => view.destroy();
    }
  }, []);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div ref={editorRef} style={{ flex: 1, textAlign: "left" }} />
      <div
        style={{
          flex: 1,
          padding: "10px",
          border: "1px solid #ccc",
          textAlign: "left",
        }}
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: previewContent }}
      />
    </div>
  );
}
