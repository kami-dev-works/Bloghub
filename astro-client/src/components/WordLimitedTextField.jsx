import { TextField } from '@mui/material';
import { countWords } from '../lib/wordLimit';

const WordLimitedTextField = ({ wordLimit, value, onChange, label, ...props }) => {
  const wordCount = countWords(value || '');
  const isOverLimit = wordCount > wordLimit;
  const isNearLimit = wordCount >= wordLimit * 0.8 && !isOverLimit;

  return (
    <TextField
      label={label}
      fullWidth
      value={value}
      onChange={onChange}
      error={isOverLimit}
      helperText={`${wordCount}/${wordLimit} words${isOverLimit ? ' - exceeds limit' : ''}`}
      FormHelperTextProps={{
        sx: {
          color: isOverLimit ? 'error.main' : isNearLimit ? 'warning.main' : 'text.secondary',
          fontWeight: isOverLimit ? 600 : 400,
        },
      }}
      {...props}
    />
  );
};

export default WordLimitedTextField;
