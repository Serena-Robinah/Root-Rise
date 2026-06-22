import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Button,
} from '@mui/material';
import { Delete as DeleteIcon, Star as StarIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { adminService } from '../../services';

export default function AdminReviews() {
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchReviews = () => {
    adminService.getReviews()
      .then(setReviews)
      .catch(() => enqueueSnackbar('Failed to load reviews', { variant: 'error' }));
  };

  React.useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteReview(deleteTarget.id);
      enqueueSnackbar('Review deleted', { variant: 'success' });
      setDeleteTarget(null);
      fetchReviews();
    } catch {
      enqueueSnackbar('Failed to delete review', { variant: 'error' });
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <StarIcon key={i} style={{ fontSize: 14, color: i <= rating ? '#E85D2A' : '#e5e7eb' }} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-green">Review Management</h1>
        <p className="text-sm text-zinc-500">Monitor and remove inappropriate customer reviews.</p>
      </div>

      <TableContainer component={Paper} className="rounded-3xl shadow-sm overflow-x-auto">
        <Table>
          <TableHead className="bg-zinc-50">
            <TableRow>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Product</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Customer</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Rating</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Comment</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs">Date</TableCell>
              <TableCell className="font-bold text-zinc-400 uppercase text-xs text-right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-zinc-400 py-12">No reviews yet</TableCell>
              </TableRow>
            ) : reviews.map(review => (
              <TableRow key={review.id} className="hover:bg-zinc-50/50 transition-colors">
                <TableCell>
                  <p className="font-bold text-sm text-primary-green">{review.product?.name}</p>
                </TableCell>
                <TableCell>
                  <p className="font-bold text-sm text-zinc-800">{review.user?.name}</p>
                  <p className="text-xs text-zinc-400">{review.user?.email}</p>
                </TableCell>
                <TableCell>{renderStars(review.rating)}</TableCell>
                <TableCell>
                  <p className="text-sm text-zinc-600 max-w-xs line-clamp-2">{review.comment || <span className="text-zinc-300 italic">No comment</span>}</p>
                </TableCell>
                <TableCell className="text-xs text-zinc-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => setDeleteTarget(review)}
                    className="text-red-400 hover:bg-red-50"
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirm delete dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} PaperProps={{ className: 'rounded-2xl p-2' }}>
        <DialogTitle className="font-display font-bold text-primary-green">Delete Review?</DialogTitle>
        <DialogContent>
          <p className="text-zinc-600 text-sm">
            Are you sure you want to delete this review by <strong>{deleteTarget?.user?.name}</strong>?
          </p>
          {deleteTarget?.comment && (
            <div className="mt-3 bg-zinc-50 rounded-xl p-3 text-sm text-zinc-500 italic">
              "{deleteTarget.comment}"
            </div>
          )}
          <p className="text-xs text-red-400 mt-3">This action cannot be undone.</p>
        </DialogContent>
        <DialogActions className="p-4 gap-2">
          <Button onClick={() => setDeleteTarget(null)} className="text-zinc-500 font-bold">Cancel</Button>
          <Button onClick={handleDelete} className="bg-red-500 text-white font-bold px-4 rounded-xl hover:bg-red-600">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
