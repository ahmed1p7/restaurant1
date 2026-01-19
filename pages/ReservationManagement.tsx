import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Calendar, Clock, User, Phone, Mail, MapPin, Plus, Search, Users } from 'lucide-react';

interface Reservation {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: Date;
  time: string;
  partySize: number;
  tableNumber: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  specialRequests: string;
}

const ReservationManagement: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      customerName: 'Ahmed Mohamed',
      customerPhone: '+201234567890',
      customerEmail: 'ahmed@example.com',
      date: new Date('2025-02-15'),
      time: '19:30',
      partySize: 4,
      tableNumber: 5,
      status: 'confirmed',
      specialRequests: 'Window seat preferred'
    },
    {
      id: 2,
      customerName: 'Fatima Ali',
      customerPhone: '+201123456789',
      customerEmail: 'fatima@example.com',
      date: new Date('2025-02-16'),
      time: '20:00',
      partySize: 2,
      tableNumber: 3,
      status: 'pending',
      specialRequests: 'Anniversary dinner'
    },
    {
      id: 3,
      customerName: 'Khaled Hassan',
      customerPhone: '+201098765432',
      customerEmail: 'khaled@example.com',
      date: new Date('2025-02-17'),
      time: '18:45',
      partySize: 6,
      tableNumber: 7,
      status: 'confirmed',
      specialRequests: 'Birthday celebration'
    },
    {
      id: 4,
      customerName: 'Nour Elsayed',
      customerPhone: '+201234567891',
      customerEmail: 'nour@example.com',
      date: new Date('2025-02-18'),
      time: '19:00',
      partySize: 3,
      tableNumber: 2,
      status: 'cancelled',
      specialRequests: 'Vegetarian options'
    }
  ]);

  const [reservationForm, setReservationForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: '',
    time: '',
    partySize: 2,
    tableNumber: 1,
    specialRequests: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddReservation = () => {
    if (reservationForm.customerName.trim() && reservationForm.date && reservationForm.time) {
      const newReservation: Reservation = {
        id: Date.now(),
        customerName: reservationForm.customerName,
        customerPhone: reservationForm.customerPhone,
        customerEmail: reservationForm.customerEmail,
        date: new Date(reservationForm.date),
        time: reservationForm.time,
        partySize: reservationForm.partySize,
        tableNumber: reservationForm.tableNumber,
        status: 'confirmed',
        specialRequests: reservationForm.specialRequests
      };
      
      setReservations([newReservation, ...reservations]);
      setReservationForm({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        date: '',
        time: '',
        partySize: 2,
        tableNumber: 1,
        specialRequests: ''
      });
      setShowAddForm(false);
    }
  };

  const handleStatusChange = (id: number, newStatus: Reservation['status']) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: newStatus } : res
    ));
  };

  const filteredReservations = reservations.filter(reservation =>
    reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.customerPhone.includes(searchTerm) ||
    reservation.tableNumber.toString().includes(searchTerm)
  );

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const upcomingReservations = filteredReservations.filter(
    res => new Date(res.date).getTime() >= new Date().setHours(0, 0, 0, 0)
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  const pastReservations = filteredReservations.filter(
    res => new Date(res.date).getTime() < new Date().setHours(0, 0, 0, 0)
  ).sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-dark">Reservation Management</h1>
        <p className="mt-1 text-neutral-dark opacity-75">Manage table reservations and bookings.</p>
      </div>

      {/* Add Reservation Form */}
      {showAddForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-dark">Create New Reservation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Customer Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-neutral-dark/40" />
                </div>
                <input
                  type="text"
                  value={reservationForm.customerName}
                  onChange={(e) => setReservationForm({...reservationForm, customerName: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                  placeholder="Enter customer name"
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
                  value={reservationForm.customerPhone}
                  onChange={(e) => setReservationForm({...reservationForm, customerPhone: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                  placeholder="Enter phone number"
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
                  value={reservationForm.customerEmail}
                  onChange={(e) => setReservationForm({...reservationForm, customerEmail: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Party Size</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-4 w-4 text-neutral-dark/40" />
                </div>
                <select
                  value={reservationForm.partySize}
                  onChange={(e) => setReservationForm({...reservationForm, partySize: parseInt(e.target.value)})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                    <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-neutral-dark/40" />
                </div>
                <input
                  type="date"
                  value={reservationForm.date}
                  onChange={(e) => setReservationForm({...reservationForm, date: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-neutral-dark/40" />
                </div>
                <input
                  type="time"
                  value={reservationForm.time}
                  onChange={(e) => setReservationForm({...reservationForm, time: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">Table Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-neutral-dark/40" />
                </div>
                <select
                  value={reservationForm.tableNumber}
                  onChange={(e) => setReservationForm({...reservationForm, tableNumber: parseInt(e.target.value)})}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>Table {num}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-dark mb-1">Special Requests</label>
              <textarea
                value={reservationForm.specialRequests}
                onChange={(e) => setReservationForm({...reservationForm, specialRequests: e.target.value})}
                className="block w-full px-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                rows={2}
                placeholder="Any special requests or notes..."
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <Button 
              variant="secondary" 
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddReservation} Icon={Plus}>
              Create Reservation
            </Button>
          </div>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-neutral-dark">Reservations</h2>
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
              placeholder="Search reservations..."
            />
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            Icon={showAddForm ? undefined : Plus}
            variant={showAddForm ? 'secondary' : 'default'}
          >
            {showAddForm ? 'Cancel' : 'Add Reservation'}
          </Button>
        </div>
      </div>

      {/* Upcoming Reservations */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-dark mb-3">Upcoming Reservations</h3>
        {upcomingReservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingReservations.map(reservation => (
              <Card key={reservation.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-neutral-dark">{reservation.customerName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-neutral-dark/80">
                      <Phone className="h-4 w-4 mr-1" />
                      <span>{reservation.customerPhone}</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-neutral-dark/80">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{reservation.customerEmail}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-neutral-dark mr-1" />
                      <span className="text-sm font-medium">{new Date(reservation.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-neutral-dark mr-1" />
                      <span className="text-sm">{reservation.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-neutral/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-dark/70">Party Size</span>
                    <span className="font-medium">{reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-neutral-dark/70">Table</span>
                    <span className="font-medium">#{reservation.tableNumber}</span>
                  </div>
                  
                  {reservation.specialRequests && (
                    <div className="mt-2">
                      <p className="text-sm text-neutral-dark/70">Special requests:</p>
                      <p className="text-sm mt-1 italic">{reservation.specialRequests}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <select
                    value={reservation.status}
                    onChange={(e) => handleStatusChange(reservation.id, e.target.value as Reservation['status'])}
                    className="text-xs border border-neutral rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-neutral-dark/30" />
            <h3 className="mt-4 text-lg font-semibold text-neutral-dark">No upcoming reservations</h3>
            <p className="mt-1 text-neutral-dark/70">Create a new reservation to get started.</p>
          </Card>
        )}
      </div>

      {/* Past Reservations */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-dark mb-3">Past Reservations</h3>
        {pastReservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastReservations.map(reservation => (
              <Card key={reservation.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-neutral-dark">{reservation.customerName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-neutral-dark/80">
                      <Phone className="h-4 w-4 mr-1" />
                      <span>{reservation.customerPhone}</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-neutral-dark/80">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{reservation.customerEmail}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-neutral-dark mr-1" />
                      <span className="text-sm font-medium">{new Date(reservation.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-neutral-dark mr-1" />
                      <span className="text-sm">{reservation.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-neutral/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-dark/70">Party Size</span>
                    <span className="font-medium">{reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-neutral-dark/70">Table</span>
                    <span className="font-medium">#{reservation.tableNumber}</span>
                  </div>
                  
                  {reservation.specialRequests && (
                    <div className="mt-2">
                      <p className="text-sm text-neutral-dark/70">Special requests:</p>
                      <p className="text-sm mt-1 italic">{reservation.specialRequests}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-neutral-dark/30" />
            <h3 className="mt-4 text-lg font-semibold text-neutral-dark">No past reservations</h3>
            <p className="mt-1 text-neutral-dark/70">Past reservations will appear here.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;