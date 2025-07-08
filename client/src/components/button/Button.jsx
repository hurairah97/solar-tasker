import React from "react";
import { Button, ConfigProvider, Space } from "antd";
import { createStyles } from "antd-style";
const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));
const Buttons = ({
  text,
  type,
  size,
  icon,
  styling,
  disabled,
  onClick,
  className,
}) => {
  const { styles } = useStyle();
  return (
    <ConfigProvider
      button={
        styling === "linearGradient"
          ? {
              className: styles.linearGradientButton,
            }
          : {}
      }
    >
      <Button
        type={type}
        size={size}
        icon={icon}
        disabled={disabled}
        onClick={onClick}
        className={className}
      >
        {text}
      </Button>
    </ConfigProvider>
  );
};
export default Buttons;
