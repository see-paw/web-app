import * as React from "react";

type LabeledInputProps = {
    label: string;
    type?: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function LabeledInput({
    label,
    type = 'text',
    name = "",
    placeholder = "",
    required = false,
    className = "",
    labelClassName = "",
    inputClassName = "",
    ...rest}: LabeledInputProps) {

    const inputId = React.useId();

    return (
        <div className={className}>
            <label htmlFor={inputId} className={labelClassName}>{label}</label>
            <input id={inputId} type={type} name={name} className={inputClassName}
                   placeholder={placeholder} required={required} {...rest} />
        </div>
    );
}

export default LabeledInput;