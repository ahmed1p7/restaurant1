import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { User, Phone, Mail, Calendar, Clock, Plus, Search, Users, Edit3, Trash2 } from 'lucide-react';

interface StaffMember {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  hireDate: Date;
  shiftSchedule: string;
  status: 'active' | 'inactive' | 'on-leave';
  totalHours: number;
  salary: number;
}

const StaffManagement: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: 1,
      name: 'Ahmed Hassan',
      position: 'Head Waiter',
      email: 'ahmed@restaurant.com',
      phone: '+201234567890',
      hireDate: new Date('2022-03-15'),
      shiftSchedule: 'Mon-Fri: 10am-6pm',
      status: 'active',
      totalHours: 160,
      salary: 3500
    },
    {
      id: 2,
      name: 'Fatima Ali',
      position: 'Sous Chef',
      email: 'fatima@restaurant.com',
      phone: '+201123456789',
      hireDate: new Date('2021-07-22'),
      shiftSchedule: 'Mon-Sat: 8am-4pm',
      status: 'active',
      totalHours: 180,
      salary: 4200
    },
    {
      id: 3,
      name: 'Mohamed Khaled',
      position: 'Bartender',
      email: 'mohamed@restaurant.com',
      phone: '+201098765432',
      hireDate: new Date('2023-01-10'),
      shiftSchedule: 'Thu-Tue: 4pm-12am',
      status: 'on-leave',
      totalHours: 120,
      salary: 2800
    },
    {
      id: 4,
      name: 'Nour Elsayed',
      position: 'Hostess',
      email: 'nour@restaurant.com',
      phone: '+201234567891',
      hireDate: new Date('2023-05-30'),
      shiftSchedule: 'Fri-Wed: 12pm-8pm',
      status: 'active',
      totalHours: 140,
      salary: 2500
    }
  ]);

  const [staffForm, setStaffForm] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    shiftSchedule: '',
    salary: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddStaff = () => {
    if (staffForm.name.trim() && staffForm.position.trim() && staffForm.email.trim()) {
      const newStaff: StaffMember = {
        id: Date.now(),
        name: staffForm.name,
        position: staffForm.position,
        email: staffForm.email,
        phone: staffForm.phone,
        hireDate: new Date(),
        shiftSchedule: staffForm.shiftSchedule,
        status: 'active',
        totalHours: 0,
        salary: staffForm.salary
      };
      
      setStaffMembers([newStaff, ...staffMembers]);
      setStaffForm({
        name: '',
        position: '',
        email: '',
        phone: '',
        shiftSchedule: '',
        salary: 0
      });
      setShowAddForm(false);
    }
  };

  const handleStatusChange = (id: number, newStatus: StaffMember['status']) => {
    setStaffMembers(staffMembers.map(staff => 
      staff.id === id ? { ...staff, status: newStatus } : staff
    ));
  };

  const filteredStaff = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: StaffMember['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'on-leave': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPositionColor = (position: string) => {
    if (position.toLowerCase().includes('chef')) return 'text-orange-600 bg-orange-100';
    if (position.toLowerCase().includes('manager')) return 'text-blue-600 bg-blue-100';
    if (position.toLowerCase().includes('bartender')) return 'text-purple-600 bg-purple-100';
    if (position.toLowerCase().includes('waiter') || position.toLowerCase().includes('host')) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-dark">Staff Management</h1>
        <p className="mt-1 text-neutral-dark opacity-75">Manage employee information and schedules.</p>
      </div>

      {/* Add Staff Form */}
      {showAddForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-dark">Add New Staff Member</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-neutral-dark/40" />
                </div>
                <input
                  type="text"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                  placeholder="Enter staff member name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Position</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-4 w-4 text-neutral-dark/40" />
                </div>
                <input
                  type="text"
                  value={staffForm.position}
                  onChange={(e) => setStaffForm({...staffForm, position: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                  placeholder="Enter position"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-neutral-dark/40" />
                </div>
                <input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-neutral-dark/40" />
                </div>
                <input
                  type="tel"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({...staffForm, phone: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Shift Schedule</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-neutral-dark/40" />
                </div>
                <input
                  type="text"
                  value={staffForm.shiftSchedule}
                  onChange={(e) => setStaffForm({...staffForm, shiftSchedule: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                  placeholder="Enter shift schedule"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Monthly Salary (EGP)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-neutral-dark/40">EGP</span>
                </div>
                <input
                  type="number"
                  value={staffForm.salary || ''}
                  onChange={(e) => setStaffForm({...staffForm, salary: Number(e.target.value)})}
                  className="block w-full pl-16 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                  placeholder="Enter salary"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <Button 
              variant="secondary" 
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddStaff} Icon={Plus}>
              Add Staff Member
            </Button>
          </div>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-neutral-dark">Staff Members</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-dark/40" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
              placeholder="Search staff members..."
            />
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            Icon={showAddForm ? undefined : Plus}
            variant={showAddForm ? 'secondary' : 'default'}
          >
            {showAddForm ? 'Cancel' : 'Add Staff'}
          </Button>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map(staff => (
          <Card key={staff.id} className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-neutral-dark">{staff.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPositionColor(staff.position)}`}>
                    {staff.position}
                  </span>
                </div>
                <div className="mt-1 flex items-center text-sm text-neutral-dark/80">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{staff.email}</span>
                </div>
                <div className="mt-1 flex items-center text-sm text-neutral-dark/80">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{staff.phone}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(staff.status)}`}>
                  {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                </span>
                <p className="text-sm font-semibold mt-1">EGP {staff.salary.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral/20">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-dark/70">Hired</span>
                <span className="font-medium">{staff.hireDate.toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between text-sm mt-1">
                <span className="text-neutral-dark/70">Shift</span>
                <span className="font-medium">{staff.shiftSchedule}</span>
              </div>
              
              <div className="flex justify-between text-sm mt-1">
                <span className="text-neutral-dark/70">Hours</span>
                <span className="font-medium">{staff.totalHours} hrs</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <select
                value={staff.status}
                onChange={(e) => handleStatusChange(staff.id, e.target.value as StaffMember['status'])}
                className="text-xs border border-neutral rounded px-2 py-1"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" Icon={Edit3}>
                  Edit
                </Button>
                <Button variant="secondary" size="sm" Icon={Trash2} className="!p-2">
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffManagement;