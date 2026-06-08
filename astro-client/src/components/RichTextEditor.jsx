import { useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box } from '@mui/material';
import { useThemeContext } from '../stores/ThemeContext';

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
  'color', 'background',
  'align', 'code-block',
];

const RichTextEditor = ({ value, onChange, placeholder = 'Write content...', height = 300 }) => {
  const { isDark } = useThemeContext();
  const quillRef = useRef(null);

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['code-block'],
      ['clean'],
    ],
  }), []);

  return (
    <Box
      sx={{
        '& .ql-toolbar': {
          borderRadius: '8px 8px 0 0',
          borderColor: 'divider',
          bgcolor: isDark ? 'grey.900' : 'grey.100',
        },
        '& .ql-container': {
          borderRadius: '0 0 8px 8px',
          borderColor: 'divider',
          fontFamily: 'inherit',
          fontSize: '1rem',
          minHeight: height,
          bgcolor: isDark ? 'grey.900' : '#fff',
        },
        '& .ql-editor': {
          minHeight: height,
          color: isDark ? 'grey.100' : 'grey.900',
        },
        '& .ql-editor.ql-blank::before': {
          color: isDark ? 'grey.500' : 'grey.400',
          fontStyle: 'normal',
        },
      }}
    >
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </Box>
  );
};

export default RichTextEditor;
