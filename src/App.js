import React, { Component } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';

// NOTE: Use the editor from source (not a build)!
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting'
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';
import Title from '@ckeditor/ckeditor5-heading/src/title';

const editorConfiguration = {
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
          if ( data.item.name !== 'iframe' ) {
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
    plugins: [
      Title,
      Paragraph, Bold, Italic, 
      Essentials , SourceEditing,
      FontFamily, FontBackgroundColor,FontColor, FontSize
    ],
    toolbar: [ 'bold', 'italic' , 'sourceEditing', "|", 'fontFamily', 'fontColor', 'fontSize', 'fontBackgroundColor', ],
    placeholder: "내용을 입력하세요",
    fontSize:{
      options:[10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
    },
    fontFamily:{
      options:[
        '나눔스퀘어',
        '나눔고딕',
        '궁서체', 
        '바탕체',
        '돋움체',
        '고딕체',
        '굴림체',
        '나눔바른펜',
        '나눔손글씨 붓',
        '나눔손글씨 펜',
        '휴먼둥근헤드라인'
      ]
    }
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
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                    } }
                />
            </div>
        );
    }
}

export default App;
