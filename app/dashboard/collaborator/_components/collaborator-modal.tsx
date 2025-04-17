'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Collaborator } from '@/constants/data';

interface CollaboratorModalProps {
  initialData: Collaborator | null;
  pageTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CollaboratorModal({
  initialData,
  pageTitle,
  isOpen,
  onClose,
}: CollaboratorModalProps) {
  const [formData, setFormData] = useState({
    firstname: initialData?.firstname || '',
    lastname: initialData?.lastname || '',
    username: initialData?.username || '',
    gender: initialData?.gender || '',
    phoneNumber: initialData?.phoneNumber || '',
    email: initialData?.email || '',
    applicationStatus: initialData?.applicationStatus || 'pending',
    address: initialData?.address || '',
  });

  function onSubmit() {
  
    onClose(); // Đóng modal sau khi submit
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{pageTitle}</DialogTitle>
          <DialogDescription>Fill out the form and submit your details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>First Name</Label>
            <Input
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
