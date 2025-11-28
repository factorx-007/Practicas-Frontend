'use client';

import { Edit2, Trash2 } from 'lucide-react';

interface MinimalCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export default function MinimalCard({
  children,
  title,
  subtitle,
  icon,
  onEdit,
  onDelete,
  actions,
  className = '',
}: MinimalCardProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-5 ${className}`}>
      {/* Header */}
      {(title || subtitle || icon || onEdit || onDelete || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {icon && (
              <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-base font-semibold text-gray-900 truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-4">
            {actions}
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                aria-label="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
