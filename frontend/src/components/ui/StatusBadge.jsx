import React from 'react';
import Badge from './Badge';

const StatusBadge = ({ status, className = '' }) => {
    if (!status) return null;

    const normalized = String(status).toLowerCase().trim();

    let variant = 'secondary';
    let label = status;

    switch (normalized) {
        case 'active':
        case 'completed':
        case 'approved':
        case 'success':
        case 'online':
        case 'healthy':
            variant = 'success';
            label = status.charAt(0).toUpperCase() + status.slice(1);
            break;
        case 'in_progress':
        case 'in progress':
        case 'pending':
        case 'review':
        case 'under_review':
        case 'warning':
            variant = 'warning';
            label = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            break;
        case 'inactive':
        case 'rejected':
        case 'failed':
        case 'cancelled':
        case 'error':
        case 'danger':
            variant = 'danger';
            label = status.charAt(0).toUpperCase() + status.slice(1);
            break;
        case 'planning':
        case 'draft':
        case 'info':
            variant = 'info';
            label = status.charAt(0).toUpperCase() + status.slice(1);
            break;
        case 'archived':
        case 'on_hold':
            variant = 'purple';
            label = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            break;
        default:
            variant = 'secondary';
            label = String(status);
    }

    return (
        <Badge variant={variant} className={className}>
            {label}
        </Badge>
    );
};

export default StatusBadge;
    