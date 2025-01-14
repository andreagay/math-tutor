import { TypeAnimation } from "react-type-animation";

const TypingAnim = () => {
  return (
    <TypeAnimation
      sequence={[
        "Dialoga con il tuo tutor personale di Matematica", // Types 'One'
        2000, // Waits 2s
        "Costruito su misura per te", // Deletes 'One' and types 'Two'
        2000, // Waits 2s
        "Un aiuto per imparare Matematica alla tua velocità", // Types 'Three' without deleting 'Two'
        2000, // Waits 2s
      ]}
      speed={50}
      repeat={Infinity}
      style={{
        fontSize: "60px",
        color: "white",
        display: "inline-block",
        textAlign: "center",
        textShadow: "1px 1px 20px #000",
      }}
    />
  );
};

export default TypingAnim;
