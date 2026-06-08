import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, IconButton, Chip, TextField,
  Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Pagination,
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Visibility from '@mui/icons-material/Visibility';
import Campaign from '@mui/icons-material/Campaign';
import Build from '@mui/icons-material/Build';
import Image from '@mui/icons-material/Image';
import Search from '@mui/icons-material/Search';
import { sliderApi, uploadApi } from '../lib/api';
import BlogImageUpload from './BlogImageUpload';
import { useData } from '../stores/DataContext';
import ImageCropper2 from './ImageCroper/ImageCropper2';
const apiBase = import.meta.env.API_URL || 'https://api.subhkarta.net';


const SliderManager = () => {
  const { showToast } = useData();
  const [slider, setSlider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemDialog, setItemDialog] = useState({ open: false, item: null });
  const [selDialog, setSelDialog] = useState({ open: false, type: 'blog' });
  const [selItems, setSelItems] = useState([]);
  const [selPagination, setSelPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
  const [selSearch, setSelSearch] = useState('');
  const [selLoading, setSelLoading] = useState(false);
  const [selSelectedId, setSelSelectedId] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedService, setSelectedService] = useState(null);




  const [fileNameB3, setFileNameB3] = useState("");
  const [fileContantB3, setfileContantB3] = useState("");
  const [finalImgB3, setfinalImgB3] = useState("");
  const [croppedImageUrlB3, setCroppedImageUrlB3] = useState(null);

  const emptyItem = {
    type: 'custom',
    title: '',
    description: '',
    image: '',
    redirectLink: '',
    blogId: '',
    serviceId: '',
    order: 0,
  };
  const [itemForm, setItemForm] = useState(emptyItem);

  useEffect(() => {
    fetchSlider();
  }, []);

  const fetchSlider = async () => {
    try {
      const res = await sliderApi.getAll();
      setSlider(res.data[0] || null);
    } catch (err) {
      console.error('Failed to fetch sliders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSelDialog = (type) => {
    setSelDialog({ open: true, type });
    setSelSelectedId(type === 'blog' ? itemForm.blogId : itemForm.serviceId);
    setSelSearch('');
    fetchSelItems(type, 1, '');
  };

  const fetchSelItems = async (type, page, search) => {
    setSelLoading(true);
    try {
      const params = { page, limit: 10, search };
      if (type === 'blog') {
        const res = await sliderApi.availableBlogs(params);
        setSelItems(res.data.blogs);
        setSelPagination(res.data.pagination);
      } else {
        const res = await sliderApi.availableServices(params);
        setSelItems(res.data.services);
        setSelPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch selectable items:', err);
    } finally {
      setSelLoading(false);
    }
  };

  const handleSelectItem = (item) => {
    if (selDialog.type === 'blog') {
      setItemForm((prev) => ({ ...prev, blogId: item._id, serviceId: '' }));
      setSelectedBlog(item);
      setSelectedService(null);
    } else {
      setItemForm((prev) => ({ ...prev, serviceId: item._id, blogId: '' }));
      setSelectedService(item);
      setSelectedBlog(null);
    }
    setSelDialog({ open: false });
  };

  const handleCreateSlider = async () => {
    try {
      const res = await sliderApi.create({ name: 'Main Slider', items: [] });
      setSlider(res.data);
      showToast('Slider created', 'success');
    } catch (err) {
      showToast('Failed to create slider', 'error');
    }
  };

  const handleDeleteSlider = async () => {
    if (!slider || !window.confirm('Delete this slider and all its slides?')) return;
    try {
      await sliderApi.delete(slider._id);
      setSlider(null);
      showToast('Slider deleted', 'success');
    } catch (err) {
      showToast('Failed to delete slider', 'error');
    }
  };

  const handleOpenAddItem = () => {
    setItemForm(emptyItem);
    setSelectedBlog(null);
    setSelectedService(null);
    setItemDialog({ open: true, item: null });
  };

  const handleOpenEditItem = (item) => {
    setItemForm({
      type: item.type || 'custom',
      title: item.title || '',
      description: item.description || '',
      image: item.image || '',
      redirectLink: item.redirectLink || '',
      blogId: item.blogId || item._blogId || '',
      serviceId: item.serviceId || item._serviceId || '',
      order: item.order || 0,
    });
    if (item.type === 'blog') {
      setSelectedBlog({ _id: item.blogId || item._blogId, title: item.title, image: item.image });
      setSelectedService(null);
    } else if (item.type === 'service') {
      setSelectedService({ _id: item.serviceId || item._serviceId, title: item.title, image: item.image });
      setSelectedBlog(null);
    } else {
      setSelectedBlog(null);
      setSelectedService(null);

       setCroppedImageUrlB3(apiBase + item.image);
    }
    setItemDialog({ open: true, item });
  };

  const handleSaveItem = async () => {
    if (!slider) return;
    try {
      const data = { ...itemForm };
      if (data.type === 'blog') {
        data.title = '';
        data.description = '';
        data.image = '';
        data.redirectLink = '';
        data.serviceId = '';
      } else if (data.type === 'service') {
        data.title = '';
        data.description = '';
        data.image = '';
        data.redirectLink = '';
        data.blogId = '';
      } else {
        if (!croppedImageUrlB3) {
          showToast('Please select image', 'error')
          return

        }

           let imgs = ""
if (  fileContantB3) {

        const response = await uploadApi?.uploadBlogImageNew({ fileContant: fileContantB3, fileName: fileNameB3 })
       imgs =  response?.data?.image

}else{
  imgs = croppedImageUrlB3
}
       
       
        data.blogId = '';
        data.serviceId = '';
        data.image =imgs;
      }

      if (itemDialog.item) {
        const itemId = itemDialog.item._id;
        await sliderApi.updateItem(slider._id, itemId, data);
      } else {
        await sliderApi.addItem(slider._id, data);
      }
      showToast('Slide saved', 'success');
      setItemDialog({ open: false, item: null });
      fetchSlider();
    } catch (err) {
      showToast('Failed to save slide', 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!slider || !window.confirm('Delete this slide?')) return;
    try {
      await sliderApi.deleteItem(slider._id, itemId);
      showToast('Slide deleted', 'success');
      fetchSlider();
    } catch (err) {
      showToast('Failed to delete slide', 'error');
    }
  };

  const handleMoveItem = async (index, direction) => {
    if (!slider) return;
    const items = [...(slider.items || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    [items[index], items[targetIndex]] = [items[targetIndex], items[index]];
    items.forEach((item, i) => (item.order = i));
    try {
      await sliderApi.update(slider._id, { items });
      showToast('Reordered', 'success');
      fetchSlider();
    } catch (err) {
      showToast('Failed to reorder', 'error');
    }
  };

  const handleToggleActive = async () => {
    if (!slider) return;
    try {
      const res = await sliderApi.update(slider._id, { isActive: !slider.isActive });
      setSlider(res.data);
      showToast(slider.isActive ? 'Slider deactivated' : 'Slider activated', 'success');
    } catch (err) {
      showToast('Failed to toggle', 'error');
    }
  };

  if (loading) return null;

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Campaign color="primary" />
          <Typography variant="h6">Slider Elements</Typography>
          {slider && (
            <Chip
              label={slider.isActive ? 'Active' : 'Inactive'}
              color={slider.isActive ? 'success' : 'default'}
              size="small"
              onClick={handleToggleActive}
              sx={{ cursor: 'pointer' }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!slider && (
            <Button variant="contained" size="small" startIcon={<Add />} onClick={handleCreateSlider}>
              Create Slider
            </Button>
          )}
          {slider && (
            <Button variant="outlined" size="small" startIcon={<Delete />} color="error" onClick={handleDeleteSlider}>
              Delete
            </Button>
          )}
        </Box>
      </Box>

      {!slider && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No slider configured. Click "Create Slider" to get started.
        </Typography>
      )}

      {slider && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {slider.items?.length || 0} slides configured
            </Typography>
            <Button variant="contained" size="small" startIcon={<Add />} onClick={handleOpenAddItem}>
              Add Slide
            </Button>
          </Box>

          {(!slider.items || slider.items.length === 0) && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No slides yet. Add a blog, service, or custom slide.
            </Typography>
          )}

          {slider.items && slider.items.length > 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={40}>#</TableCell>
                    <TableCell width={40}></TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slider.items
                    .slice()
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((item, index) => (
                      <TableRow key={item._id || index}>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">{index + 1}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {index > 0 && (
                              <IconButton size="small" onClick={() => handleMoveItem(index, -1)}>
                                <ArrowUpward fontSize="inherit" />
                              </IconButton>
                            )}
                            {index < slider.items.length - 1 && (
                              <IconButton size="small" onClick={() => handleMoveItem(index, 1)}>
                                <ArrowDownward fontSize="inherit" />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {item.image ? (
                            <Box
                              component="img"
                              src={item.image}
                              alt=""
                              sx={{ width: 80, height: 48, objectFit: 'cover', borderRadius: 1 }}
                            />
                          ) : (
                            <Box sx={{ width: 80, height: 48, bgcolor: 'action.hover', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Image sx={{ fontSize: 20, color: 'text.disabled' }} />
                            </Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title || '(no title)'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.type === 'blog' ? 'Blog' : item.type === 'service' ? 'Service' : item.redirectLink ? 'Custom (Link)' : 'Custom'}
                            size="small"
                            color={item.type === 'blog' ? 'info' : item.type === 'service' ? 'secondary' : 'default'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleOpenEditItem(item)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDeleteItem(item._id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      <Dialog open={itemDialog.open} onClose={() => setItemDialog({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>
          {itemDialog.item ? 'Edit Slide' : 'Add Slide'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Slide Type</InputLabel>
              <Select
                value={itemForm.type}
                label="Slide Type"
                onChange={(e) => setItemForm({ ...emptyItem, type: e.target.value })}
              >
                <MenuItem value="custom">Custom Slide</MenuItem>
                <MenuItem value="blog">From Blog</MenuItem>
                <MenuItem value="service">From Service</MenuItem>
              </Select>
            </FormControl>

            {itemForm.type === 'blog' && (
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<Search />}
                  onClick={() => handleOpenSelDialog('blog')}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  {selectedBlog ? selectedBlog.title : 'Choose Blog'}
                </Button>
                {selectedBlog && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {selectedBlog.image && (
                      <Box
                        component="img"
                        src={selectedBlog.image}
                        sx={{ width: 40, height: 28, objectFit: 'cover', borderRadius: 0.5 }}
                      />
                    )}
                    <Chip
                      label={selectedBlog.title}
                      size="small"
                      color="info"
                      onDelete={() => {
                        setItemForm((prev) => ({ ...prev, blogId: '' }));
                        setSelectedBlog(null);
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}

            {itemForm.type === 'service' && (
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<Build />}
                  onClick={() => handleOpenSelDialog('service')}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  {selectedService ? selectedService.title : 'Choose Service'}
                </Button>
                {selectedService && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {selectedService.image && (
                      <Box
                        component="img"
                        src={selectedService.image}
                        sx={{ width: 40, height: 28, objectFit: 'cover', borderRadius: 0.5 }}
                      />
                    )}
                    <Chip
                      label={selectedService.title}
                      size="small"
                      color="secondary"
                      onDelete={() => {
                        setItemForm((prev) => ({ ...prev, serviceId: '' }));
                        setSelectedService(null);
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}

            {itemForm.type === 'custom' && (
              <>
                <TextField
                  label="Title"
                  fullWidth
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                />
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                />
                <TextField
                  label="Redirect Link"
                  fullWidth
                  value={itemForm.redirectLink}
                  onChange={(e) => setItemForm({ ...itemForm, redirectLink: e.target.value })}
                  placeholder="https://example.com"
                />
                {/* <BlogImageUpload
                  onUploadComplete={(url) => setItemForm({ ...itemForm, image: url })}
                  label="Slide Image"
                  folder="uploads/slider"
                /> */}
                <ImageCropper2
                  aspectRatio={4 / 3}
                  // onImageCrop={handleImageCrop}
                  setfileContant={setfileContantB3}
                  setFileName={setFileNameB3}
                  setfinalImg={setfinalImgB3}
                  aspectwidth={16}
                  aspectheight={10}
                  onCropComplete={setCroppedImageUrlB3}
                />

                {croppedImageUrlB3 && (
                  <div>
                    <img
                      src={croppedImageUrlB3}
                      alt="Cropped"
                      width={160}
                      height={100}
                    />
                  </div>
                )}

              </>
            )}

            {(itemForm.type === 'blog' || itemForm.type === 'service') && itemForm.image && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">Override Image (optional):</Typography>
                {/* <BlogImageUpload
                  onUploadComplete={(url) => setItemForm({ ...itemForm, image: url })}
                  label="Custom Image"
                  folder="uploads/slider"
                /> */}

                <ImageCropper2
                  aspectRatio={4 / 3}
                  // onImageCrop={handleImageCrop}
                  setfileContant={setfileContantB3}
                  setFileName={setFileNameB3}
                  setfinalImg={setfinalImgB3}
                  aspectwidth={16}
                  aspectheight={10}
                  onCropComplete={setCroppedImageUrlB3}
                />

                {croppedImageUrlB3 && (
                  <div>
                    <img
                      src={croppedImageUrlB3}
                      alt="Cropped"
                      width={160}
                      height={100}
                    />
                  </div>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialog({ open: false })}>Cancel</Button>
          <Button
            onClick={handleSaveItem}
            variant="contained"
            disabled={
              itemForm.type === 'custom'
                ? false
                : itemForm.type === 'blog'
                  ? !itemForm.blogId
                  : !itemForm.serviceId
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={selDialog.open} onClose={() => setSelDialog({ open: false })} maxWidth="md" fullWidth>
        <DialogTitle>
          Select {selDialog.type === 'blog' ? 'Blog' : 'Service'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by title..."
              value={selSearch}
              onChange={(e) => {
                setSelSearch(e.target.value);
                fetchSelItems(selDialog.type, 1, e.target.value);
              }}
              InputProps={{
                startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            {selLoading ? (
              <Typography sx={{ textAlign: 'center', py: 4 }}>Loading...</Typography>
            ) : selItems.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4 }} color="text.secondary">No items found</Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width={80}>Image</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell width={80} align="center">Select</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selItems.map((item) => (
                      <TableRow
                        key={item._id}
                        hover
                        sx={{ cursor: 'pointer', bgcolor: selSelectedId === item._id ? 'action.selected' : 'inherit' }}
                        onClick={() => setSelSelectedId(item._id)}
                      >
                        <TableCell>
                          {item.image ? (
                            <Box
                              component="img"
                              src={item.image}
                              sx={{ width: 64, height: 40, objectFit: 'cover', borderRadius: 0.5 }}
                            />
                          ) : (
                            <Box sx={{ width: 64, height: 40, bgcolor: 'action.hover', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Image sx={{ fontSize: 18, color: 'text.disabled' }} />
                            </Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant={selSelectedId === item._id ? 'contained' : 'outlined'}
                            onClick={(e) => { e.stopPropagation(); handleSelectItem(item); }}
                          >
                            Pick
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {selPagination.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Pagination
                  count={selPagination.pages}
                  page={selPagination.page}
                  onChange={(e, p) => fetchSelItems(selDialog.type, p, selSearch)}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelDialog({ open: false })}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SliderManager;
