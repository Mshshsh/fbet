const User = require('./User');
const HeroSlide = require('./HeroSlide');
const SpinHistory = require('./SpinHistory');
const PointCode = require('./PointCode');
const CodeRedemption = require('./CodeRedemption');
const WheelSegment = require('./WheelSegment');
const Message = require('./Message');
const PinnedMessage = require('./PinnedMessage');
const Partner = require('./Partner');
const Page = require('./Page');
const { Task, TaskCompletion } = require('./Task');
const { MarketItem, MarketTransaction } = require('./Market');
const { Ticket, TicketEntry } = require('./Ticket');
const { Tournament, TournamentEntry } = require('./Tournament');
const Event = require('./Event');
const BonusBuy = require('./BonusBuy');
const { BonusHuntSession, BonusHuntSlot } = require('./BonusHunt');
const SpecialOdd = require('./SpecialOdd');
const StreamConfig = require('./StreamConfig');
const WinEntry = require('./WinEntry');

// İlişkiler
User.hasMany(Message, { foreignKey: 'userId', as: 'messages' });
Message.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(SpinHistory, { foreignKey: 'userId', as: 'spins' });
SpinHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

PointCode.hasMany(CodeRedemption, { foreignKey: 'codeId', as: 'redemptions' });
CodeRedemption.belongsTo(PointCode, { foreignKey: 'codeId' });
CodeRedemption.belongsTo(User, { foreignKey: 'userId', as: 'user' });

BonusHuntSession.hasMany(BonusHuntSlot, { foreignKey: 'sessionId', as: 'slots' });
BonusHuntSlot.belongsTo(BonusHuntSession, { foreignKey: 'sessionId' });

Tournament.hasMany(TournamentEntry, { foreignKey: 'tournamentId', as: 'entries' });
TournamentEntry.belongsTo(Tournament, { foreignKey: 'tournamentId' });
TournamentEntry.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Ticket.hasMany(TicketEntry, { foreignKey: 'ticketId', as: 'entries' });
TicketEntry.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  HeroSlide,
  Message,
  PinnedMessage,
  Partner,
  Page,
  Task,
  TaskCompletion,
  MarketItem,
  MarketTransaction,
  Ticket,
  TicketEntry,
  Tournament,
  TournamentEntry,
  Event,
  BonusBuy,
  BonusHuntSession,
  BonusHuntSlot,
  SpecialOdd,
  StreamConfig,
  WinEntry,
  SpinHistory,
  PointCode,
  CodeRedemption,
  WheelSegment,
};
