import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Essentials,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Font,
  Paragraph,
  Heading,
  List,
  Link,
  BlockQuote,
  CodeBlock,
  Alignment,
  Image,
  ImageBlock,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  Table,
  HorizontalLine,
  RemoveFormat,
  Undo,
} from 'ckeditor5';
import { Box, useTheme } from '@mui/material';
import 'ckeditor5/ckeditor5.css';

const CKEditorWrapper = ({ value, onChange, placeholder = 'Write content...', height = 300, minimal = false }) => {
  const { palette } = useTheme();
  const isDark = palette.mode === 'dark';

  const plugins = minimal
    ? [Essentials, Bold, Italic, Underline, Paragraph, Heading, List, Link, Undo]
    : [Essentials, Bold, Italic, Underline, Strikethrough, Font, Paragraph, Heading, List, Link, BlockQuote, CodeBlock, Alignment, Image, ImageBlock, ImageToolbar, ImageCaption, ImageStyle, Table, HorizontalLine, RemoveFormat, Undo];

  const toolbar = minimal
    ? ['undo', 'redo', '|', 'heading', '|', 'bold', 'italic', 'underline', '|', 'bulletedList', 'numberedList', '|', 'link']
    : ['undo', 'redo', '|', 'heading', '|', 'bold', 'italic', 'underline', 'strikethrough', '|', 'fontColor', 'fontBackgroundColor', '|', 'alignment:left', 'alignment:center', 'alignment:right', '|', 'bulletedList', 'numberedList', '|', 'link', 'blockQuote', 'codeBlock', '|', 'insertTable', 'horizontalLine', '|', 'removeFormat'];

  const config = minimal
    ? { placeholder, plugins, toolbar, licenseKey: 'GPL' }
    : {
        placeholder,
        plugins,
        toolbar,
        licenseKey: 'GPL',
        image: { toolbar: ['imageStyle:inline', 'imageStyle:block', 'imageStyle:side', '|', 'imageTextAlternative'] },
        table: { contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'] },
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
          ],
        },
        fontColor: {
          colors: [
            { color: '#000', label: 'Black' }, { color: '#333', label: 'Dark Gray' },
            { color: '#666', label: 'Gray' }, { color: '#999', label: 'Light Gray' },
            { color: '#f00', label: 'Red' }, { color: '#ff0', label: 'Yellow' },
            { color: '#0f0', label: 'Green' }, { color: '#00f', label: 'Blue' },
            { color: '#6366f1', label: 'Indigo' }, { color: '#fff', label: 'White' },
          ],
        },
      };

  return (
    <Box
      sx={{
        '& .ck-editor': { maxWidth: '100%' },
        '& .ck-editor__top': { borderRadius: '8px 8px 0 0 !important' },
        '& .ck-editor__main': { borderRadius: '0 0 8px 8px' },
        '& .ck-editor__editable': { minHeight: height, maxHeight: 600, bgcolor: isDark ? 'grey.900' : '#fff', color: isDark ? 'grey.100' : 'grey.900' },
        '& .ck-content': { minHeight: height, maxHeight: 600 },
        '& .ck-toolbar': { bgcolor: isDark ? 'grey.900' : 'grey.100', borderColor: 'divider' },
        '& .ck.ck-editor__editable_inline': { borderColor: 'divider' },
        ...(isDark ? {
          '& .ck.ck-toolbar': { bgcolor: '#1e1e1e', borderColor: '#333' },
          '& .ck.ck-editor__editable_inline': { bgcolor: '#121212', color: '#e0e0e0', borderColor: '#333' },
          '& .ck.ck-button': { color: '#e0e0e0' },
          '& .ck.ck-button:hover': { bgcolor: '#333' },
          '& .ck.ck-button.ck-on': { bgcolor: '#444' },
          '& .ck-dropdown__panel': { bgcolor: '#1e1e1e', borderColor: '#333' },
          '& .ck.ck-list__item': { color: '#e0e0e0' },
          '& .ck.ck-list__item:hover': { bgcolor: '#333' },
        } : {}),
      }}
    >
      <CKEditor
        editor={ClassicEditor}
        data={value || ''}
        onChange={(_event, editor) => { onChange(editor.getData()); }}
        config={config}
      />
    </Box>
  );
};

export default CKEditorWrapper;
