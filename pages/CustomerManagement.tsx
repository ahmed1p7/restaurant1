import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { User, Phone, Mail, MapPin, Calendar, Star, Plus, Search } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: Date;
  totalOrders: number;
  totalSpent: number;
  favoriteDishes: string[];
  specialRequests: string;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Ahmed Mohamed',
      email: 'ahmed@example.com',
      phone: '+201234567890',
      address: 'Nasr City, Cairo',
      joinDate: new Date('2023-05-15'),
      totalOrders: 24,
      totalSpent: 1250.50,
      favoriteDishes: ['Margherita Pizza', 'Caesar Salad'],
      specialRequests: 'No onions, extra napkins'
    },
    {
      id: 2,
      name: 'Fatima Ali',
      email: 'fatima@example.com',
      phone: '+201123456789',
      address: 'Maadi, Cairo',
      joinDate: new Date('2023-03-22'),
      totalOrders: 18,
      totalSpent: 980.75,
      favoriteDishes: ['Tiramisu', 'Spaghetti Carbonara'],
      specialRequests: 'Gluten-free options'
    },
    {
      id: 3,
      name: 'Khaled Hassan',
      email: 'khaled@example.com',
      phone: '+201098765432',
      address: 'Downtown, Cairo',
      joinDate: new Date('2023-07-10'),
      totalOrders: 32,
      totalSpent: 1850.25,
      favoriteDishes: ['Filet Mignon', 'Espresso'],
      specialRequests: 'Quiet corner table preferred'
    },
    {
      id: 4,
      name: 'Nour Elsayed',
      email: 'nour@example.com',
      phone: '+201234567891',
      address: 'Heliopolis, Cairo',
      joinDate: new Date('2023-01-30'),
      totalOrders: 15,
      totalSpent: 720.00,
      favoriteDishes: ['Bruschetta', 'Orange Juice'],
      specialRequests: 'Vegetarian options only'
    }
  ]);

  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCustomer = () => {
    if (customerForm.name.trim() && customerForm.email.trim()) {
      const newCustomer: Customer = {
        id: Date.now(),
        name: customerForm.name,
        email: customerForm.email,
        phone: customerForm.phone,
        address: customerForm.address,
        joinDate: new Date(),
        totalOrders: 0,
        totalSpent: 0,
        favoriteDishes: [],
        specialRequests: ''
      };
      
      setCustomers([newCustomer, ...customers]);
      setCustomerForm({ name: '', email: '', phone: '', address: '' });
      setShowAddForm(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 1000) return 'VIP';
    if (totalSpent >= 500) return 'Gold';
    return 'Regular';
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'VIP': return 'text-purple-600 bg-purple-100';
      case 'Gold': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-dark">Customer Management</h1>
        <p className="mt-1 text-neutral-dark opacity-75">Manage customer profiles and preferences.</p>
      </div>

      {/* Add Customer Form */}
      {showAddForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-dark">Add New Customer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-neutral-dark/40" />
                </div>
                <input
                  type="text"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                  placeholder="Enter customer name"
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
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
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
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-neutral-dark/40" />
                </div>
                <input
                  type="text"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                  placeholder="Enter address"
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
            <Button onClick={handleAddCustomer} Icon={Plus}>
              Add Customer
            </Button>
          </div>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-neutral-dark">Customer List</h2>
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
              placeholder="Search customers..."
            />
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            Icon={showAddForm ? undefined : Plus}
            variant={showAddForm ? 'secondary' : 'default'}
          >
            {showAddForm ? 'Cancel' : 'Add Customer'}
          </Button>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <Card key={customer.id} className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-neutral-dark">{customer.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTierColor(getCustomerTier(customer.totalSpent))}`}>
                    {getCustomerTier(customer.totalSpent)}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-neutral-dark/80">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{customer.email}</span>
                </div>
                <div className="mt-1 flex items-center text-sm text-neutral-dark/80">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{customer.phone}</span>
                </div>
                <div className="mt-1 flex items-center text-sm text-neutral-dark/80">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{customer.address}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{customer.totalOrders}</span>
                </div>
                <p className="text-sm font-semibold mt-1">${customer.totalSpent.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral/20">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-dark/70">Member since</span>
                <span className="font-medium">{customer.joinDate.toLocaleDateString()}</span>
              </div>
              
              {customer.favoriteDishes.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-neutral-dark/70">Favorite dishes:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {customer.favoriteDishes.map((dish, idx) => (
                      <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {customer.specialRequests && (
                <div className="mt-2">
                  <p className="text-sm text-neutral-dark/70">Special requests:</p>
                  <p className="text-sm mt-1 italic">{customer.specialRequests}</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" size="sm">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerManagement;