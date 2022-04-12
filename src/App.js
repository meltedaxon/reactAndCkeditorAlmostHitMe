import React, { Component } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';

// NOTE: Use the editor from source (not a build)!
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting'

const editorConfiguration = {
    plugins: [Paragraph, Bold, Italic, Essentials , SourceEditing],
    toolbar: [ 'bold', 'italic' , 'sourceEditing'],
    placeholder: "내용을 입력하세요",
    extraPlugins: [
      //출처 : https://github.com/ckeditor/ckeditor5/issues/7411#issuecomment-654780905
      function ( editor ) {
        // Allow <iframe> elements in the model.               
        editor.model.schema.register( 'iframe', {
          allowWhere: '$text',
          allowContentOf: '$block'
        } );
        // Allow <iframe> elements in the model to have all attributes.
        editor.model.schema.addAttributeCheck( context => {
          if ( context.endsWith( 'iframe' ) ) {
            return true;
          }
        } );						
                                     // View-to-model converter converting a view <iframe> with all its attributes to the model.
        editor.conversion.for( 'upcast' ).elementToElement( {
          view: 'iframe',
          model: ( viewElement, modelWriter ) => {
            return modelWriter.writer.createElement( 'iframe', viewElement.getAttributes() );
          }
        } );
      
        // Model-to-view converter for the <iframe> element (attributes are converted separately).
        editor.conversion.for( 'downcast' ).elementToElement( {
          model: 'iframe',
          view: 'iframe'
        } );
      
        // Model-to-view converter for <iframe> attributes.
        // Note that a lower-level, event-based API is used here.
        editor.conversion.for( 'downcast' ).add( dispatcher => {
          dispatcher.on( 'attribute', ( evt, data, conversionApi ) => {
            // Convert <iframe> attributes only.
            if ( data.item.name != 'iframe' ) {
              return;
            }
      
            const viewWriter = conversionApi.writer;
            const viewIframe = conversionApi.mapper.toViewElement( data.item );
      
            // In the model-to-view conversion we convert changes.
            // An attribute can be added or removed or changed.
            // The below code handles all 3 cases.
            if ( data.attributeNewValue ) {
              viewWriter.setAttribute( data.attributeKey, data.attributeNewValue, viewIframe );
            } else {
              viewWriter.removeAttribute( data.attributeKey, viewIframe );
            }
          } );
        } );
        },
    ], 
};

class App extends Component {
    render() {
        return (
            <div className="App">
                <h2>Using CKEditor 5 from source in React</h2>
                <CKEditor
                    editor={ ClassicEditor }
                    config={ editorConfiguration }
                    data="<p>Hello from CKEditor 5!</p>"
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />
            </div>
        );
    }
}

export default App;
