import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';

const formatSlotDate = (date) => `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

const formatSlotTime = (date) => date.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
});

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { api, currencySymbol, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [message, setMessage] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const fetchDocInfo = useCallback(async () => {
    try {
      const { data } = await api.get(`/api/doctor/${docId}`);

      if (data.success) {
        setDocInfo(data.doctor);
      } else {
        setDocInfo(null);
        setMessage(data.message || 'Doctor not found');
      }
    } catch (error) {
      setDocInfo(null);
      setMessage(error.response?.data?.message || 'Doctor not found');
    }
  }, [api, docId]);

  const getAvailableSlots = useCallback(() => {
    if (!docInfo) return;

    const slots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(17, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(currentDate.getHours() > 8 ? currentDate.getHours() + 1 : 8);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 0 : 30);
      } else {
        currentDate.setHours(8);
        currentDate.setMinutes(0);
      }
      currentDate.setSeconds(0, 0);

      const slotDate = formatSlotDate(currentDate);
      const bookedTimes = docInfo.slots_booked?.[slotDate] || [];
      const timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = formatSlotTime(currentDate);

        timeSlots.push({
          datetime: new Date(currentDate),
          slotDate,
          time: formattedTime,
          booked: bookedTimes.includes(formattedTime)
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slots.push(timeSlots);
    }

    setDocSlots(slots);
    setSlotIndex(0);
    setSlotTime('');
  }, [docInfo]);

  const bookAppointment = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    const selectedSlot = docSlots[slotIndex]?.find((item) => item.time === slotTime);

    if (!selectedSlot) {
      setMessage('Please select a slot');
      return;
    }

    try {
      setIsBooking(true);
      setMessage('');

      const { data } = await api.post('/api/user/book-appointment', {
        doctorId: docId,
        slotDate: selectedSlot.slotDate,
        slotTime: selectedSlot.time
      });

      if (data.success) {
        setMessage(data.message || 'Appointment booked successfully');
        await fetchDocInfo();
        await getDoctorsData();
      } else {
        setMessage(data.message || 'Failed to book appointment');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [fetchDocInfo]);

  useEffect(() => {
    getAvailableSlots();
  }, [getAvailableSlots]);

  return docInfo && (
    <div className="p-3 sm:p-6 overflow-hidden">
      {/* ----------- Doctor Details ------------- */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* --------- Doctor Image --------- */}
        <div className="w-full sm:w-auto flex justify-center">
          <img
            className="bg-blue-50 w-full max-w-52 sm:max-w-60 object-contain rounded-t-xl"
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        {/* --------- Doctor Info --------- */}
        <div className="flex-1 w-full border border-gray-400 rounded-lg p-5 sm:p-8 py-8 sm:py-20 bg-white mx-0 sm:mx-0 mt-0">
          {/* Name + Verified Badge */}
          <p className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            {docInfo.name}
            <img src={assets.verified_icon} alt="Verified" className="w-5 h-5" />
          </p>

          {/* Degree + Speciality + Experience */}
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-gray-600">{docInfo.degree} - {docInfo.speciality}</p>
            <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium">
              {docInfo.experience}
            </button>
          </div>

          {/* ------- Doctor About -------- */}
          <div className="mt-6">
            <p className="flex items-center gap-2 text-lg font-medium text-gray-800">
              About <img src={assets.info_icon} alt="Info" className="w-5 h-5" />
            </p>
            <p className="mt-2 text-gray-600 leading-relaxed">
              {docInfo.about}
            </p>
          </div>
          <p>Appointment fees: <span>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>

      {/* ------- Booking slots ------- */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p className="mb-4 font-bold text-blue-500 text-lg animate-blink">Booking slots</p>

        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.length && docSlots.map((item, index) => (
            <div
              onClick={() => {
                setSlotIndex(index);
                setSlotTime('');
              }}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
              key={index}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots.length && docSlots[slotIndex].map((item, index) => (
            <p
              onClick={() => !item.booked && setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full ${item.booked ? 'text-gray-300 bg-gray-100 border border-gray-200 cursor-not-allowed line-through' : slotTime === item.time ? 'bg-primary text-white cursor-pointer' : 'text-gray-400 border border-gray-200 cursor-pointer'}`}
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
        <button
          onClick={bookAppointment}
          disabled={isBooking}
          className="bg-primary text-white text-sm font-light px-8 sm:px-14 py-3 rounded-full my-6 w-full sm:w-auto"
        >
          {isBooking ? 'Booking...' : 'Book an appointment'}
        </button>
      </div>
      {/* --------- Related doctor --------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  );
};

export default Appointment;
