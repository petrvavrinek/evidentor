import clsx from "clsx";
import React from "react";

type HeadingProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export function TypographyH1(props: HeadingProps) {
  return (
    <h1
      {...props}
      className={clsx(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        props.className
      )}
    >
      {props.children}
    </h1>
  );
}

export function TypographyH2(props: HeadingProps) {
  return (
    <h2
      {...props}
      className={clsx(
        "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        props.className
      )}
    >
      {props.children}
    </h2>
  );
}

export function TypographyH3(props: HeadingProps) {
  return (
    <h3
      {...props}
      className={clsx(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        props.className
      )}
    >
      {props.children}
    </h3>
  );
}
