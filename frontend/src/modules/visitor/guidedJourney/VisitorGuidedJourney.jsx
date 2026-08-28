import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Compass, Footprints, Bus, Train, MapPin, QrCode, Volume2, HelpCircle, CheckCircle2, ArrowRight, ArrowLeft, Shield, Map as MapIcon, Languages, Info } from 'lucide-react';
import { TOURIST_DESTINATIONS } from '../explore/VisitorExplore';
import MapComponent from '../../../components/MapComponent';

export default function VisitorGuidedJourney() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(1); // 0-indexed or 1-indexed (e.g. step 2)
  const [showQR, setShowQR] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const dest = TOURIST_DESTINATIONS.find(d => d.id === id) || TOURIST_DESTINATIONS[0];

  const steps = [
    {
      num: 1,
      mode: 'walk',
      title: 'WALK OUT OF METRO STATION',
      instruction: 'Take Exit 2 (Poonamallee High Rd) from Central Metro.',
      distance: '180 meters',
      estimated: '3 minutes',
      lookFor: 'Green Exit 2 Signboard / Towards Government Hospital',
      tamilText: 'வெளியேறும் வழி 2 (Exit 2)',
      explanation: 'Walk through the main concourse to Exit 2 escalator. There is an elevator available on your right. Once outside, the bus bay will be 50 meters ahead.'
    },
    {
      num: 2,
      mode: 'walk',
      title: 'WALK TO BUS PLATFORM 4',
      instruction: 'Cross the sheltered pedestrian pathway to Bay 4.',
      distance: '350 meters',
      estimated: '5 minutes',
      lookFor: 'Bus Stop Sign marked "588 / 201 Express - Mahabalipuram"',
      tamilText: 'பேருந்து நிறுத்தம் - மாமல்லபுரம் (Mahabalipuram)',
      explanation: 'Walk along the yellow tactile paving outside the station. The sign is written in both English and Tamil. If you cannot spot the bay, show this screen to the uniformed station master at the help desk.'
    },
    {
      num: 3,
      mode: 'bus',
      title: 'BOARD BUS 588 EXPRESS',
      instruction: 'Board the AC Deluxe bus heading towards Mahabalipuram.',
      distance: '48 km',
      estimated: '1h 35 minutes',
      lookFor: 'Bus Number 588 / Electronic Front Board',
      tamilText: 'வழித்தடம் 588 - விரைவுப் பேருந்து (Route 588 Express)',
      explanation: 'Show your digital QR pass to the bus conductor upon boarding. Air conditioning is active. The conductor will announce Mahabalipuram when approaching.'
    },
    {
      num: 4,
      mode: 'walk',
      title: 'ALIGHT AT MAHABALIPURAM BUS STAND',
      instruction: 'Step down at the main Mahabalipuram bus depot circle.',
      distance: '400 meters',
      estimated: '6 minutes',
      lookFor: 'Archaeological Survey of India (ASI) Shore Temple Signboard',
      tamilText: 'மாமல்லபுரம் கடற்கரை கோவில் (Shore Temple)',
      explanation: 'Follow the Shore Temple Road lined with stone carving workshops. The ocean breeze will guide you straight to the monument gate ticket checkpoint.'
    },
    {
      num: 5,
      mode: 'arrive',
      title: 'ARRIVE AT SHORE TEMPLE GATE',
      instruction: 'Scan your foreign tourist ticket at the ASI automated barrier gate.',
      distance: '0 meters',
      estimated: 'Arrived 🎉',
      lookFor: 'UNESCO World Heritage Entrance Gate',
      tamilText: 'வரவேற்கிறது - உலக பாரம்பரிய தளம் (Welcome to World Heritage Site)',
      explanation: 'You have arrived safely! Audio guides and certified tour guides are available at the entrance.'
    }
  ];

  const currentStep = steps[currentStepIndex] || steps[0];

  const handleAudio = () => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      setSpeaking(true);
      const text = `Step ${currentStep.num}. ${currentStep.title}. ${currentStep.instruction}. Look for: ${currentStep.lookFor}. ${currentStep.explanation}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setShowExplanation(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px 60px 20px' }}>
      {/* Top Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => navigate(`/visitor/destination/${id}`)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fbbf24',
            fontSize: '0.9rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Destination Details
        </button>

        <span className="badge" style={{ background: '#10b981', color: '#000', fontWeight: 800 }}>
          🟢 GUIDED TRAVEL ACTIVE
        </span>
      </div>

      {/* Main Guided Step Card */}
      <div className="glass-panel" style={{
        padding: '32px 28px',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        marginBottom: '28px'
      }}>
        {/* Step Indicator Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#fbbf24',
            background: 'rgba(245, 158, 11, 0.15)',
            padding: '4px 14px',
            borderRadius: '999px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            STEP {currentStep.num} OF {steps.length}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAudio}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: speaking ? '#ef4444' : '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Volume2 size={16} /> {speaking ? 'Stop' : 'Listen'}
            </button>

            <button
              onClick={() => setShowQR(true)}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#60a5fa',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <QrCode size={16} /> Show QR Ticket
            </button>
          </div>
        </div>

        {/* Step Title & Instruction */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 800, color: '#fff', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentStep.mode === 'bus' ? <Bus size={28} color="#3b82f6" /> : <Footprints size={28} color="#fbbf24" />}
            {currentStep.title}
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
            {currentStep.instruction}
          </p>
        </div>

        {/* Distance & Look For Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          padding: '18px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '16px',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>DISTANCE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{currentStep.distance}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>ESTIMATED TIME</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>{currentStep.estimated}</div>
          </div>
        </div>

        {/* Look For Box with Bilingual Translation */}
        <div style={{
          padding: '18px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '6px' }}>
            👀 LOOK FOR THIS SIGNBOARD
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            {currentStep.lookFor}
          </div>
          <div style={{
            padding: '8px 12px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '8px',
            fontSize: '0.88rem',
            color: '#fbbf24',
            fontFamily: 'sans-serif'
          }}>
            🇮🇳 Tamil Text: <strong>{currentStep.tamilText}</strong>
          </div>
        </div>

        {/* Explain This Step Accordion */}
        <div style={{ marginBottom: '28px' }}>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60a5fa',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} /> Explain This Step In Plain English
            </span>
            <span>{showExplanation ? '▲ Hide' : '▼ View Details'}</span>
          </button>

          {showExplanation && (
            <div style={{
              padding: '16px 20px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '0 0 12px 12px',
              fontSize: '0.92rem',
              color: '#e2e8f0',
              lineHeight: 1.6
            }}>
              💡 <strong>Travel Tip:</strong> {currentStep.explanation}
            </div>
          )}
        </div>

        {/* Step Navigation Controls */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'space-between' }}>
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="btn-secondary"
            style={{ padding: '14px 20px', opacity: currentStepIndex === 0 ? 0.4 : 1 }}
          >
            <ArrowLeft size={16} /> Previous Step
          </button>

          <button
            onClick={handleNextStep}
            disabled={currentStepIndex === steps.length - 1}
            style={{
              flex: 1,
              padding: '14px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)'
            }}
          >
            {currentStepIndex === steps.length - 1 ? 'Destination Reached 🎉' : 'I Am Here ➔ Next Step'} <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            padding: '28px',
            borderRadius: '24px',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            maxWidth: '360px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#fff', margin: '0 0 6px 0' }}>Tourist Digital Pass</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>Show to Bus Conductor or ASI Barrier</p>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', display: 'inline-block', marginBottom: '20px' }}>
              <QrCode size={180} color="#000" />
            </div>
            <div style={{ fontFamily: 'monospace', color: '#fbbf24', fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>
              TOURIST-PASS-9821-IND
            </div>
            <button
              onClick={() => setShowQR(false)}
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
