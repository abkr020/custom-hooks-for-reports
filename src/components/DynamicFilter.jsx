import React from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";

const DynamicFilter = ({
    filter,
    value = [],
    options = [],
    onChange,
}) => {

    // MULTI SELECT
    if (filter.type === "multi-select") {

        return (
            <MultiSelectDropdown
                label={filter.label}
                options={options}
                selected={value}
                setSelected={onChange}
            />
        );
    }

    // SINGLE SELECT
    if (filter.type === "select") {

        return (
            <div>

                <label>
                    {filter.label}
                </label>

                <select
                    value={value || ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                >

                    <option value="">
                        All
                    </option>

                    {options.map((option) => (
                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>
                    ))}

                </select>

            </div>
        );
    }

    // INPUT
    if (filter.type === "input") {

        return (
            <div>

                <label>
                    {filter.label}
                </label>

                <input
                    value={value || ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                />

            </div>
        );
    }

    return null;
};

export default DynamicFilter;