import type { CSSProperties } from "react";

const signature = "Developed by Aissam LAKHYARI";

export function DeveloperSignature() {
  return <div className="developer-signature" dir="ltr">
    <span className="signature-accessible">{signature}</span>
    <span className="signature-visual" aria-hidden="true">
      {signature.split(" ").map((word, wordIndex, words) => {
        const offset = words.slice(0, wordIndex).join(" ").length + (wordIndex ? 1 : 0);
        return <span className="signature-word" key={wordIndex}>
          {Array.from(word).map((letter, index) => <span key={index} className={`signature-letter signature-color-${(offset + index) % 3}`} style={{ "--letter-animation": `signature-letter-${offset + index}` } as CSSProperties}>{letter}</span>)}
          {wordIndex < words.length - 1 ? " " : null}
        </span>;
      })}
    </span>
  </div>;
}
