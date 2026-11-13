'use client';

import { componentRegistry, type ComponentBlock } from './registry';

export default function PageRenderer({ data, is_theme = true }:
    { data: { isHome: boolean, isDefault: boolean, sections: ComponentBlock[] }, is_theme: boolean }) {

    console.log("isHome", data.isHome, "isDefault", data.isDefault)
    // If no sections, render NoComponents
    if (!data.sections || data.sections.length === 0) {
        const NoComponents = componentRegistry['NoComponents'];

        if (NoComponents) {
            console.log("!data.isHome || data.isDefault", (!data.isHome && data.isDefault))
            return <NoComponents is_theme={is_theme} layout_page={(!data.isHome && data.isDefault)} raw_data={{}} />;
        }

        // Fallback if NoComponents is not registered
        return <div>No content available</div>;
    }

    return (
        <>
            {data.sections.map((block, index) => {
                const Component = componentRegistry[block.type];
                if (!Component) {
                    console.warn(`Component "${block.type}" not found in registry`);
                    return null;
                }

                // Create new props object WITHOUT mutating the original block
                const propsToPass = {
                    ...block.props as any,
                    raw_data: {
                        ...(block.props || {}),
                        component_index: index,
                    },
                };

                // Type-safe spread: TypeScript now narrows the props correctly
                // return <Component key={index} {...(block.props as any)} is_theme={is_theme} raw_data={block.props} />;
                return <Component key={index} {...propsToPass} is_theme={is_theme} />;
            })}
        </>
    );
}