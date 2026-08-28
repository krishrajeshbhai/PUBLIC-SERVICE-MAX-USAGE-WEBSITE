import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Search, MapPin, Star, Bus, Train, Clock, ArrowRight, ShieldCheck, Heart, Sparkles, Navigation } from 'lucide-react';
import { getAuthUser } from '../../../store/authStore';

export const TOURIST_DESTINATIONS = [
  {
    id: 'dest-1',
    name: 'Mahabalipuram Shore Temple',
    category: 'Culture & History',
    tag: '🏛 UNESCO World Heritage',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    description: '7th-century coastal stone temples and monolithic rock reliefs overlooking the Bay of Bengal.',
    transitSummary: 'Bus 588 / 201 Express (1h 45m)',
    fare: '₹120 ($1.45)',
    entryFee: '₹600 for foreign tourists / ₹40 Indian',
    timings: '06:00 AM - 06:00 PM',
    safetyScore: '99% Safe & Verified',
    nearestStation: 'Tambaram / Thiruvanmiyur Bus Terminal'
  },
  {
    id: 'dest-2',
    name: 'Kapaleeshwarar Temple, Mylapore',
    category: 'Temples',
    tag: '🛕 Dravidian Architecture',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?w=800&auto=format&fit=crop&q=80',
    description: 'Ancient Shiva temple with vibrant multi-tiered gopuram and surrounding traditional flower bazaar.',
    transitSummary: 'Metro Blue Line + 5 min Walk (28m)',
    fare: '₹35 ($0.42)',
    entryFee: 'Free Entry',
    timings: '05:30 AM - 12:00 PM, 04:00 PM - 09:00 PM',
    safetyScore: '100% Tourist Friendly',
    nearestStation: 'Thirumayilai MRTS / AG-DMS Metro'
  },
  {
    id: 'dest-3',
    name: 'Marina Beach & Light House',
    category: 'Beaches',
    tag: '🏖 World\'s 2nd Longest Urban Beach',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
    description: '13 km natural urban beach famous for evening sea breeze, fresh sundal street snacks, and lighthouse panorama.',
    transitSummary: 'Bus 21G / MRTS Train (22m)',
    fare: '₹20 ($0.24)',
    entryFee: 'Free (Lighthouse ₹50)',
    timings: 'Open 24 Hours (Lighthouse 10 AM - 5 PM)',
    safetyScore: '98% Tourist Friendly',
    nearestStation: 'Light House MRTS Station'
  },
  {
    id: 'dest-4',
    name: 'Fort St. George & Museum',
    category: 'Culture & History',
    tag: '🏛 1644 Colonial Fortress',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
    description: 'The first English fortress in India, housing colonial artifacts, St. Mary’s Church, and heritage battle arms.',
    transitSummary: 'Metro Blue Line to High Court (18m)',
    fare: '₹25 ($0.30)',
    entryFee: '₹300 foreign / ₹25 Indian',
    timings: '09:00 AM - 05:00 PM (Closed Fridays)',
    safetyScore: '100% Verified Secure',
    nearestStation: 'High Court Metro Station'
  },
  {
    id: 'dest-5',
    name: 'DakshinaChitra Heritage Museum',
    category: 'Culture & History',
    tag: '🎭 Living History Village',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80',
    description: '18 authentic heritage houses from Tamil Nadu, Kerala, Karnataka, and Andhra with live artisan craft workshops.',
    transitSummary: 'Bus 109 / ECR Express (1h 15m)',
    fare: '₹80 ($0.96)',
    entryFee: '₹350 foreign / ₹175 Indian',
    timings: '10:00 AM - 06:00 PM (Closed Tuesdays)',
    safetyScore: '100% Tourist Verified',
    nearestStation: 'Muttukadu Boat House Bus Stop'
  }
];

export default function VisitorExplore() {
  const navigate = useNavigate();
  const [user] = useState(getAuthUser() || { nationality: '🇺🇸 US', hotel: 'The Taj Connemara' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Culture & History', 'Beaches', 'Temples', 'Food', 'Nature', 'Shopping'];

  const filtered = TOURIST_DESTINATIONS.filter(d => {
    const matchCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 48px 20px' }}>
      {/* Current Trip Banner */}
      <div style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.3) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        borderRadius: '16px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: '#fbbf24',
            color: '#000',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            fontWeight: 900
          }}>
            <Compass size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              YOUR CURRENT TRIP
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '2px 0' }}>
              Explore Chennai & Tamil Nadu Coast 🇮🇳
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              Base Hotel: <strong style={{ color: '#fff' }}>{user.hotel || 'The Taj Connemara'}</strong> · 3 days remaining
            </div>
          </div>
        </div>

        <Link
          to="/visitor/help"
          style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fbbf24',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          🏨 Take Me Back to Hotel ➔
        </Link>
      </div>

      {/* Hero Exploration Search */}
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 32px auto' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
          What would you like to explore?
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 20px 0' }}>
          Discover UNESCO temples, sandy coastlines, and living heritage using public transport.
        </p>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '15px' }} />
          <input
            type="text"
            placeholder="Search attractions, temples, beaches, or heritage sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              borderRadius: '14px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fff',
              fontSize: '0.98rem',
              outline: 'none',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}
          />
        </div>
      </div>

      {/* Category Chips */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '28px'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              whiteSpace: 'nowrap',
              padding: '10px 18px',
              borderRadius: '999px',
              border: selectedCategory === cat ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
              background: selectedCategory === cat ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedCategory === cat ? '#fbbf24' : '#cbd5e1',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Destinations Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '28px'
      }}>
        {filtered.map(dest => (
          <div
            key={dest.id}
            onClick={() => navigate(`/visitor/destination/${dest.id}`)}
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#f59e0b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            {/* Image Preview */}
            <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
              <img
                src={dest.image}
                alt={dest.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                color: '#fbbf24',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {dest.tag}
              </div>

              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(16, 185, 129, 0.9)',
                color: '#000',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Star size={12} fill="#000" /> {dest.rating}
              </div>
            </div>

            {/* Content Details */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>
                  {dest.name}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.45, marginBottom: '16px' }}>
                  {dest.description}
                </p>
              </div>

              <div>
                {/* Transit Route Summary Pill */}
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  color: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bus size={15} /> {dest.transitSummary}
                  </span>
                  <span style={{ fontWeight: 800 }}>{dest.fare}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                  <span>{dest.safetyScore}</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Guide <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
