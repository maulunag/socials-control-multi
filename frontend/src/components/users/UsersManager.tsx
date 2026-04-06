import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Shield, ShieldAlert, User } from 'lucide-react';
import { fetchWithAuth } from '../../utils/api';

interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'USER';
  company_id: number | null;
  company_name?: string;
  created_at: string;
}

interface Company {
  id: number;
  name: string;
}

export default function UsersManager({ companyFilter, onClearFilter }: { companyFilter?: number | null, onClearFilter?: () => void }) {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    company_id: ''
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = currentUser.role === 'SUPERADMIN';

  const loadData = async () => {
    try {
      setLoading(true);
      const usersData = await fetchWithAuth('/users.php');
      setUsers(usersData);
      
      if (isSuperAdmin) {
        const companiesData = await fetchWithAuth('/companies.php');
        setCompanies(companiesData);
      }
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { ...formData };
      if (!isSuperAdmin) {
        payload.company_id = currentUser.company_id;
      }

      if (editingUser) {
        payload.id = editingUser.id;
        await fetchWithAuth('/users.php', {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchWithAuth('/users.php', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetchWithAuth(`/users.php?id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'USER', company_id: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (user: SystemUser) => {
    setEditingUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      password: '', // Leave blank unless they want to change it
      role: user.role, 
      company_id: user.company_id?.toString() || '' 
    });
    setIsModalOpen(true);
  };

  const getRoleIcon = (role: string) => {
    if (role === 'SUPERADMIN') return <ShieldAlert className="w-4 h-4 text-danger" />;
    if (role === 'ADMIN') return <Shield className="w-4 h-4 text-accent" />;
    return <User className="w-4 h-4 text-blue-400" />;
  };

  const filteredUsers = companyFilter 
    ? users.filter(u => u.company_id === companyFilter)
    : users;

  const currentFilteredCompany = companyFilter 
    ? companies.find(c => c.id === companyFilter)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
             User Management
             {currentFilteredCompany && (
                <span className="text-xs font-semibold px-2 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full flex items-center gap-2">
                   Filtered by: {currentFilteredCompany.name}
                   <button onClick={onClearFilter} className="hover:text-white"><X className="w-3 h-3"/></button>
                </span>
             )}
          </h3>
          <p className="text-slate-400">Control access and roles across the platform</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {error && <div className="bg-danger/20 border border-danger/50 text-danger px-4 py-3 rounded-lg">{error}</div>}

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-sm font-medium text-slate-400">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                {isSuperAdmin && <th className="px-6 py-4">Company</th>}
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 4 : 3} className="px-6 py-8 text-center text-slate-400">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 4 : 3} className="px-6 py-8 text-center text-slate-400">
                     {companyFilter ? 'No users found for this company.' : 'No users found.'}
                  </td>
                </tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase pt-1">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white">
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </td>
                  {isSuperAdmin && (
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      {user.company_name || <span className="text-slate-500 italic">System</span>}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors mr-2 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {user.id !== currentUser.id && (
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel w-full max-w-md p-6 border border-white/10 shadow-2xl relative my-8">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">
              {editingUser ? 'Edit User' : 'Create User'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {editingUser ? 'Password (leave blank to keep current)' : 'Password'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    {isSuperAdmin && <option value="SUPERADMIN">Superadmin</option>}
                  </select>
                </div>
                
                {isSuperAdmin && formData.role !== 'SUPERADMIN' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Company</label>
                    <select
                      required
                      value={formData.company_id}
                      onChange={e => setFormData({ ...formData, company_id: e.target.value })}
                      className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select Company</option>
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-primary/25 transition-all"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
