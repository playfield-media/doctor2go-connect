import { registerBlockType } from '@wordpress/blocks';
import { PanelBody, RangeControl, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

registerBlockType( 'd2g/doctors-listing', {
    edit: function Edit( { attributes, setAttributes } ) {
        const blockProps = useBlockProps();

        return (
            <>
                <InspectorControls>
                    <PanelBody title={ __( 'Doctors Listing Settings' ) }>
                        <RangeControl
                            label={ __( 'Posts Per Page' ) }
                            value={ attributes.posts_per_page }
                            onChange={ ( value ) => setAttributes( { posts_per_page: value } ) }
                            min={ 1 }
                            max={ 20 }
                        />
                        <SelectControl
                            label={ __( 'Columns' ) }
                            value={ attributes.columns }
                            options={ [
                                { label: '1', value: 1 },
                                { label: '2', value: 2 },
                                { label: '3', value: 3 },
                                { label: '4', value: 4 },
                            ] }
                            onChange={ ( value ) => setAttributes( { columns: parseInt( value ) } ) }
                        />
                        <SelectControl
                            label={ __( 'Template' ) }
                            value={ attributes.template }
                            options={ [
                                { label: 'Grid', value: 'grid' },
                                // Add others
                            ] }
                            onChange={ ( value ) => setAttributes( { template: value } ) }
                        />
                        <TextControl
                            label={ __( 'Wrapper Class' ) }
                            value={ attributes.wrapper_class }
                            onChange={ ( value ) => setAttributes( { wrapper_class: value } ) }
                        />
                        <TextControl
                            label={ __( 'Orderby' ) }
                            value={ attributes.orderby }
                            onChange={ ( value ) => setAttributes( { orderby: value } ) }
                        />
                        <SelectControl
                            label={ __( 'Order' ) }
                            value={ attributes.order }
                            options={ [
                                { label: 'DESC', value: 'DESC' },
                                { label: 'ASC', value: 'ASC' },
                            ] }
                            onChange={ ( value ) => setAttributes( { order: value } ) }
                        />
                        <TextControl
                            label={ __( 'Meta Key' ) }
                            value={ attributes.meta_key }
                            onChange={ ( value ) => setAttributes( { meta_key: value } ) }
                        />
                    </PanelBody>
                </InspectorControls>
                <div { ...blockProps }>
                    <p>{ __( 'Doctors listing preview (dynamic on frontend).' ) }</p>
                    {/* Optional: Use <ServerSideRender> from @wordpress/server-side-render for live preview */}
                </div>
            </>
        );
    },
    save: function save() {
        return null; // Dynamic block, no save needed
    },
} );
