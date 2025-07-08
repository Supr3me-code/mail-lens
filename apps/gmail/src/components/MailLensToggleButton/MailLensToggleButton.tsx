import React from "react";
import styles from "./MailLensToggleButton.module.css";
import { MailLensIcon } from "../icons/MailLensIcon";
import { CloseIcon } from "../icons/CloseIcon";
import cx from "classnames";

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
      className={cx(
        styles.toggleButton,
        isPanelVisible && styles.closeButtonStyle
      )}
      onClick={onClick}
      aria-label={
        isPanelVisible ? "Hide MailLens Panel" : "Show MailLens Panel"
      }
    >
      <span className={styles.toggleButtonLabel}>
        {isPanelVisible ? "Close" : "Mail Lens"}
      </span>
      <span className={styles.toggleButtonIcon}>
        {isPanelVisible ? (
          <CloseIcon width={16} height={16} />
        ) : (
          <MailLensIcon width={16} height={16} />
        )}
      </span>
    </button>
  );
};
