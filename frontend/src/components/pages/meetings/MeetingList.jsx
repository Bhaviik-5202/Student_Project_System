

const MeetingList = ({ meetings, onEdit, onDelete }) => {
  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
        >
          <div>
            <h4 className="font-medium">{meeting.title}</h4>
            <p className="text-sm text-gray-600">
              {meeting.date} at {meeting.time}
            </p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => onEdit(meeting)}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(meeting.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeetingList;
