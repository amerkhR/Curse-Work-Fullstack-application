import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import "./ResumeEditor.css";

const ResumeEditor = () => {
  const [markdown, setMarkdown] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const textareaRef = useRef(null);

  const insertMarkdown = (prefix, suffix = "") => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText =
      markdown.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      markdown.substring(end);
    setMarkdown(newText);

    // Устанавливаем курсор после вставленного текста
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const textBeforeCursor = markdown.substring(0, start);
      const lastLine = textBeforeCursor.split("\n").pop();

      // Автоматическое форматирование списков
      if (/^(\s*)[*+-]\s/.test(lastLine)) {
        e.preventDefault();
        const indent = lastLine.match(/^(\s*)/)[0];
        const newText =
          markdown.substring(0, start) +
          "\n" +
          indent +
          "* " +
          markdown.substring(start);
        setMarkdown(newText);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + indent.length + 3,
            start + indent.length + 3
          );
        }, 0);
      }
      // Автоматическое форматирование заголовков
      else if (/^(\s*)#+\s/.test(lastLine)) {
        e.preventDefault();
        const indent = lastLine.match(/^(\s*)/)[0];
        const newText =
          markdown.substring(0, start) +
          "\n" +
          indent +
          "# " +
          markdown.substring(start);
        setMarkdown(newText);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + indent.length + 3,
            start + indent.length + 3
          );
        }, 0);
      }
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("resume-preview");
    const canvas = await html2canvas(element);
    const dataUrl = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
  };

  const handleExportWord = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: markdown,
                  size: 24,
                }),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "resume.docx");
  };

  if (!isLoggedIn) {
    return (
      <div className="resume-container">
        <div className="alert alert-warning">
          Для создания резюме необходимо авторизоваться
        </div>
      </div>
    );
  }

  return (
    <div className="resume-container">
      <div className="resume-toolbar">
        <button
          className={`btn ${
            !isPreview ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setIsPreview(false)}
        >
          Редактировать
        </button>
        <button
          className={`btn ${isPreview ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setIsPreview(true)}
        >
          Предпросмотр
        </button>
        {isPreview && (
          <>
            <button className="btn btn-success" onClick={handleExportPDF}>
              Экспорт в PDF
            </button>
            <button className="btn btn-info" onClick={handleExportWord}>
              Экспорт в Word
            </button>
          </>
        )}
      </div>

      {!isPreview && (
        <div className="markdown-toolbar">
          <button onClick={() => insertMarkdown("# ")} title="Заголовок 1">
            H1
          </button>
          <button onClick={() => insertMarkdown("## ")} title="Заголовок 2">
            H2
          </button>
          <button onClick={() => insertMarkdown("### ")} title="Заголовок 3">
            H3
          </button>
          <button
            onClick={() => insertMarkdown("**", "**")}
            title="Жирный текст"
          >
            B
          </button>
          <button onClick={() => insertMarkdown("*", "*")} title="Курсив">
            I
          </button>
          <button
            onClick={() => insertMarkdown("~~", "~~")}
            title="Зачеркнутый текст"
          >
            S
          </button>
          <button
            onClick={() => insertMarkdown("- ")}
            title="Маркированный список"
          >
            •
          </button>
          <button
            onClick={() => insertMarkdown("1. ")}
            title="Нумерованный список"
          >
            1.
          </button>
          <button
            onClick={() => insertMarkdown("```\n", "\n```")}
            title="Блок кода"
          >
            {"</>"}
          </button>
          <button onClick={() => insertMarkdown("> ")} title="Цитата">
            ❝
          </button>
          <button onClick={() => insertMarkdown("[", "](url)")} title="Ссылка">
            🔗
          </button>
          <button
            onClick={() => insertMarkdown("![", "](url)")}
            title="Изображение"
          >
            🖼️
          </button>
          <button
            onClick={() => insertMarkdown("---\n")}
            title="Горизонтальная линия"
          >
            —
          </button>
        </div>
      )}

      <div className="resume-content">
        {!isPreview ? (
          <textarea
            ref={textareaRef}
            className="resume-editor"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите текст резюме в формате Markdown..."
          />
        ) : (
          <div id="resume-preview" className="resume-preview">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={docco}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeEditor;
