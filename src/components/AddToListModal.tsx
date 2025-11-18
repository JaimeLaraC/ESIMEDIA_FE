import React, { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContextHooks';
import Modal from '../customcomponents/Modal';
import Combobox from '../customcomponents/Combobox';
import Textbox from '../customcomponents/Textbox';
import { ContentListService } from '../services/contentListService';
import type { ContentListResponse } from '../services/contentListService';
import { validateListName, validateListDescription } from '../utils/fieldValidator';

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentTitle: string;
  onSuccess?: () => void;
}

export const AddToListModal: React.FC<AddToListModalProps> = ({
  isOpen,
  onClose,
  contentId,
  contentTitle,
  onSuccess
}) => {
  const { t } = useI18n();
  const [lists, setLists] = useState<ContentListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load user lists when modal opens
  useEffect(() => {
    if (isOpen) {
      loadUserLists();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedListId('');
      setShowNewListForm(false);
      setNewListName('');
      setNewListDescription('');
      setErrors({});
    }
  }, [isOpen]);

  const loadUserLists = async () => {
    setLoading(true);
    try {
      const userLists = await ContentListService.getMyContentLists();
      setLists(userLists);
    } catch (error) {
      console.error('Error loading user lists:', error);
      // Could show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (showNewListForm) {
      // Validate new list form
      const nameError = validateListName(newListName);
      if (nameError) {
        newErrors.name = t(nameError);
      }

      const descriptionError = validateListDescription(newListDescription);
      if (descriptionError) {
        newErrors.description = t(descriptionError);
      }
    } else {
      // Validate list selection
      if (!selectedListId) {
        newErrors.list = t('addToListModal.errors.selectList');
      }
      // Additional validation can be added here
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleListSelection = (listId: string) => {
    setSelectedListId(listId);
    if (listId === 'new') {
      setShowNewListForm(true);
    } else {
      setShowNewListForm(false);
    }
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (showNewListForm) {
        // Create new list and add content
        await ContentListService.createContentList({
          nombre: newListName,
          descripcion: newListDescription || undefined,
          visibilidad: 'PRIVADA',
          contenidoIds: [contentId]
        });
        // Reload lists to include the new one
        await loadUserLists();
      } else {
        // Add content to existing list
        await ContentListService.addContentToList(selectedListId, contentId);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding content to list:', error);
      // Could show a toast notification here
    } finally {
      setSubmitting(false);
    }
  };

  const comboboxOptions = lists.map(list => ({
    value: list.id,
    label: list.nombre,
    description: list.descripcion
  }));

  const newListOption = {
    value: 'new',
    label: t('addToListModal.newListOption'),
    description: t('addToListModal.newListDescription')
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('addToListModal.titleWithContent').replace('{{contentTitle}}', contentTitle)}
      size="medium"
    >
      <div className="add-to-list-modal">
        <div className="modal-section">
          <label className="modal-label">
            {t('addToListModal.selectListLabel')}
          </label>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>{t('addToListModal.loadingLists')}</span>
            </div>
          ) : (
            <Combobox
              options={[...comboboxOptions, newListOption]}
              value={selectedListId}
              onChange={handleListSelection}
              placeholder={t('addToListModal.selectListPlaceholder')}
              error={errors.list}
              disabled={submitting}
            />
          )}
        </div>

        {showNewListForm && (
          <div className="modal-section new-list-form">
            <div className="form-group">
              <Textbox
                label={t('addToListModal.nameLabel')}
                value={newListName}
                onChange={setNewListName}
                placeholder={t('addToListModal.namePlaceholder')}
                error={errors.name}
                disabled={submitting}
                required
              />
            </div>

            <div className="form-group">
              <Textbox
                label={t('addToListModal.descriptionLabel')}
                value={newListDescription}
                onChange={setNewListDescription}
                placeholder={t('addToListModal.descriptionPlaceholder')}
                error={errors.description}
                disabled={submitting}
                multiline
                rows={3}
              />
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            {t('common.cancel')}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting || loading}
          >
            {submitting ? t('addToListModal.adding') : t('addToListModal.addToList')}
          </button>
        </div>
      </div>
    </Modal>
  );
};