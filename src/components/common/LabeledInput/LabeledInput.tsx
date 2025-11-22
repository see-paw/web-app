import * as React from "react";

/**
 * Props for the LabeledInput component
 * 
 * @typedef {Object} LabeledInputProps
 * @property {string} label - Label text displayed above the input
 * @property {string} [type='text'] - HTML input type
 * @property {string} name - Input name attribute
 * @property {string} [placeholder=''] - Input placeholder text
 * @property {boolean} [required=false] - Whether the input is required
 * @property {string} [className=''] - CSS class for the container div
 * @property {string} [labelClassName=''] - CSS class for the label element
 * @property {string} [inputClassName=''] - CSS class for the input element
 */
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

/**
 * Labeled input component that renders an input with an associated label
 * 
 * @param {LabeledInputProps} props - Component props
 * @returns {JSX.Element} Labeled input element
 */
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
