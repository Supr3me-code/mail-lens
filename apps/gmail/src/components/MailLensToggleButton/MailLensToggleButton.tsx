import React from "react";
import styles from "./MailLensToggleButton.module.css";
import MailLensIcon from "../../assets/MailLensIcon.svg";
import CloseIcon from "../../assets/CloseIcon.svg";

type Props = {
  onClick: () => void;
  isPanelVisible: boolean;
};

export const MailLensToggleButton: React.FC<Props> = ({
  onClick,
  isPanelVisible,
}) => {
  return (
    <button
      className={styles.toggleButton}
      onClick={onClick}
      aria-label={
        isPanelVisible ? "Hide MailLens Panel" : "Show MailLens Panel"
      }
    >
      <span className={styles.toggleButtonLabel}>
        {isPanelVisible ? <CloseIcon /> : <MailLensIcon />}
      </span>
    </button>
  );
};
