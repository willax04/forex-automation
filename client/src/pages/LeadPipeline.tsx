import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { leadsAPI } from '../services/api';
import { Plus, User, Phone, Calendar, Tag } from 'lucide-react';

const LeadPipeline: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  const stages = [
    { id: 'new', title: 'New Lead', color: 'bg-blue-500' },
    { id: 'warm', title: 'Warm Lead', color: 'bg-yellow-500' },
    { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500' },
    { id: 'closed', title: 'Closed Sale', color: 'bg-green-500' },
    { id: 'lost', title: 'Lost', color: 'bg-red-500' },
  ];

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await leadsAPI.getAll();
      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (leadData: Partial<Lead>) => {
    try {
      await leadsAPI.create(leadData as Omit<Lead, 'id' | 'created_at' | 'last_contact'>);
      await loadLeads();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (draggedLead && draggedLead.status !== newStatus) {
      try {
        await leadsAPI.update(draggedLead.id, { status: newStatus });
        await loadLeads();
      } catch (error) {
        console.error('Error updating lead status:', error);
      }
    }
    
    setDraggedLead(null);
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gradient-start"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="container-mobile">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Lead Pipeline</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </button>
        </div>

        {/* Pipeline Columns */}
        <div className="space-y-6">
          {stages.map((stage) => {
            const stageLeads = getLeadsByStatus(stage.id);
            
            return (
              <div key={stage.id} className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                  <h3 className="font-semibold">{stage.title}</h3>
                  <span className="text-sm text-gray-500 dark:text-light-blue/60">
                    ({stageLeads.length})
                  </span>
                </div>

                <div
                  className="space-y-2 min-h-[100px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {stageLeads.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-light-blue/60 text-sm">
                      No leads in this stage
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={() => handleDragStart(lead)}
                        className="bg-white/50 dark:bg-white/10 p-3 rounded-lg cursor-move hover:bg-white/70 dark:hover:bg-white/20 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="w-4 h-4 text-gray-400" />
                              <h4 className="font-medium truncate">{lead.name}</h4>
                            </div>
                            
                            {lead.contact && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-light-blue/80 mb-1">
                                <Phone className="w-3 h-3" />
                                <span>{lead.contact}</span>
                              </div>
                            )}
                            
                            {lead.notes && (
                              <p className="text-sm text-gray-600 dark:text-light-blue/80 mb-2 line-clamp-2">
                                {lead.notes}
                              </p>
                            )}
                            
                            {lead.tags && (
                              <div className="flex items-center space-x-1 mb-2">
                                <Tag className="w-3 h-3 text-gray-400" />
                                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                  {lead.tags}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-light-blue/60">
                              <span>
                                Last contact: {new Date(lead.last_contact).toLocaleDateString()}
                              </span>
                              
                              {lead.follow_up_date && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    {new Date(lead.follow_up_date).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Lead Modal */}
        {showAddModal && <AddLeadModal onAdd={handleAddLead} onClose={() => setShowAddModal(false)} />}
      </div>
    </div>
  );
};

// Add Lead Modal Component
const AddLeadModal: React.FC<{
  onAdd: (lead: Partial<Lead>) => void;
  onClose: () => void;
}> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    status: 'new',
    notes: '',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    onAdd(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add New Lead</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter lead name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="input-field"
              placeholder="Phone, email, or social handle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="new">New Lead</option>
              <option value="warm">Warm Lead</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed">Closed Sale</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Any additional notes about this lead"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., High Value, Urgent, Product X"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadPipeline;
