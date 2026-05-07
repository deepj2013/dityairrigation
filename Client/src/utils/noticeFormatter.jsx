import React from "react";

const COLOR_TOKEN_REGEX = /^\{color:([#a-zA-Z0-9(),.\s-]+)\}([\s\S]+)\{\/color\}$/;
const INLINE_TOKEN_REGEX = /(\{color:[#a-zA-Z0-9(),.\s-]+\}[\s\S]+?\{\/color\}|\*\*[^*]+\*\*|\*[^*]+\*)/g;

const sanitizeColor = (value) => {
  const color = String(value || "").trim();
  if (/^#[0-9a-fA-F]{3,8}$/.test(color)) return color;
  if (/^(rgb|rgba|hsl|hsla)\([\d\s.,%+-]+\)$/.test(color)) return color;
  if (/^[a-zA-Z]+$/.test(color)) return color;
  return null;
};

const renderInline = (line, keyPrefix = "line") => {
  if (!line) return [];

  const parts = line.split(INLINE_TOKEN_REGEX).filter(Boolean);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }

    if (
      part.startsWith("*") &&
      part.endsWith("*") &&
      !part.startsWith("**") &&
      !part.endsWith("**")
    ) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }

    const colorMatch = part.match(COLOR_TOKEN_REGEX);
    if (colorMatch) {
      const color = sanitizeColor(colorMatch[1]);
      if (color) {
        return (
          <span key={key} style={{ color }}>
            {colorMatch[2]}
          </span>
        );
      }
    }

    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
};

export const NOTICE_EDITOR_HELP = "Use toolbar buttons: Bold, Italic, Numbered List, and Color.";

const ALLOWED_TAGS = new Set(["P", "BR", "STRONG", "B", "EM", "I", "U", "OL", "UL", "LI", "SPAN", "DIV"]);

const sanitizeHtmlContent = (inputHtml) => {
  if (!inputHtml || typeof window === "undefined") return "";

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(inputHtml, "text/html");

  const cleanNode = (node) => {
    if (node.nodeType === window.Node.TEXT_NODE) {
      return doc.createTextNode(node.textContent || "");
    }

    if (node.nodeType !== window.Node.ELEMENT_NODE) {
      return doc.createTextNode("");
    }

    const tagName = node.tagName.toUpperCase();
    if (!ALLOWED_TAGS.has(tagName)) {
      const fragment = doc.createDocumentFragment();
      Array.from(node.childNodes).forEach((child) => {
        fragment.appendChild(cleanNode(child));
      });
      return fragment;
    }

    const cleanElement = doc.createElement(tagName.toLowerCase());
    if (tagName === "SPAN") {
      const color = sanitizeColor(node.style?.color || "");
      if (color) cleanElement.style.color = color;
    }

    Array.from(node.childNodes).forEach((child) => {
      cleanElement.appendChild(cleanNode(child));
    });

    return cleanElement;
  };

  const container = doc.createElement("div");
  Array.from(doc.body.childNodes).forEach((child) => {
    container.appendChild(cleanNode(child));
  });
  return container.innerHTML;
};

const hasHtmlTags = (text) => /<\/?[a-z][\s\S]*>/i.test(String(text || ""));

export const isNoticeContentEmpty = (text) => {
  const raw = String(text || "").trim();
  if (!raw) return true;

  if (hasHtmlTags(raw) && typeof window !== "undefined") {
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(raw, "text/html");
    return !doc.body.textContent?.trim();
  }

  return !raw;
};

export const renderNoticeContent = (text) => {
  const raw = String(text || "");
  if (hasHtmlTags(raw)) {
    const safeHtml = sanitizeHtmlContent(raw);
    return <div className="space-y-2" dangerouslySetInnerHTML={{ __html: safeHtml }} />;
  }

  const lines = raw.split("\n");
  const blocks = [];
  let listBuffer = [];

  const flushList = () => {
    if (!listBuffer.length) return;
    blocks.push(
      <ol key={`list-${blocks.length}`} className="list-decimal space-y-2 pl-6">
        {listBuffer.map((line, index) => (
          <li key={`li-${blocks.length}-${index}`}>{renderInline(line, `li-${blocks.length}-${index}`)}</li>
        ))}
      </ol>
    );
    listBuffer = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    const numbered = line.match(/^\d+\.\s+(.*)$/);

    if (numbered) {
      listBuffer.push(numbered[1]);
      return;
    }

    flushList();
    if (!line) return;

    blocks.push(
      <p key={`p-${blocks.length}`} className="whitespace-pre-line">
        {renderInline(line, `p-${blocks.length}`)}
      </p>
    );
  });

  flushList();
  return blocks;
};
