import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Send, X, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function FeedbackModal({ isOpen, onClose, userAuth }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync user info on open
  useEffect(() => {
    if (isOpen) {
      setName(userAuth?.userName || (isArabic ? 'زائر غير مسجل' : 'Guest User'));
      setEmail(userAuth?.userEmail || '');
      setRating(0);
      setHoverRating(0);
      setFeedbackText('');
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isOpen, userAuth, isArabic]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim() && rating === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden z-10 p-6 md:p-8 transition-colors duration-300 ${
              isDarkMode
                ? 'bg-[#0d1527]/95 border-slate-700/80 text-white shadow-[0_20px_60px_rgba(0,0,0,0.7)]'
                : 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.15)]'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className={`absolute top-5 end-5 p-2 rounded-full transition-colors ${
                isDarkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <div>
                {/* Header Section */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#7c3aed] text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
                    <MessageSquare className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">
                      {t("Submit Feedback", "إرسال الملاحظات")}
                    </h3>
                    <p className={`text-xs md:text-sm mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t("Help us improve DGE GeoVision GIS experience", "ساعدنا في تحسين تجربة DGE GeoVision GIS")}
                    </p>
                  </div>
                </div>

                <div className={`h-[1px] w-full my-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200/80'}`} />

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Rating Section */}
                  <div className="text-center py-1">
                    <label className={`block text-sm font-semibold mb-2.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                      {t("Rate your experience:", "قيّم تجربتك:")}
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((starIndex) => {
                        const active = (hoverRating || rating) >= starIndex;
                        return (
                          <button
                            key={starIndex}
                            type="button"
                            onClick={() => setRating(starIndex)}
                            onMouseEnter={() => setHoverRating(starIndex)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                          >
                            <Star
                              className={`w-7 h-7 md:w-8 md:h-8 transition-colors duration-200 ${
                                active
                                  ? 'fill-[#7c3aed] text-[#7c3aed] dark:fill-[#a855f7] dark:text-[#a855f7] drop-shadow-sm'
                                  : isDarkMode
                                  ? 'text-slate-600 fill-slate-800/40'
                                  : 'text-slate-300 fill-slate-100'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fields Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {t("Your Name", "الاسم")}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("Guest User", "زائر غير مسجل")}
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border font-medium focus:outline-none focus:ring-2 transition-all ${
                          isDarkMode
                            ? 'bg-[#121c33] border-slate-700 text-white placeholder-slate-500 focus:ring-purple-500/40 focus:border-purple-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {t("Email Address", "البريد الإلكتروني")}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl border font-medium focus:outline-none focus:ring-2 transition-all ${
                          isDarkMode
                            ? 'bg-[#121c33] border-slate-700 text-white placeholder-slate-500 focus:ring-purple-500/40 focus:border-purple-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {t("Your Feedback / Suggestions", "ملاحظاتك / اقتراحاتك")}
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder={t(
                        "Tell us what features or GIS datasets you would like to see...",
                        "أخبرنا بالخصائص أو مجموعات البيانات الجغرافية التي ترغب في رؤيتها..."
                      )}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border font-medium focus:outline-none focus:ring-2 transition-all resize-none ${
                        isDarkMode
                          ? 'bg-[#121c33] border-slate-700 text-white placeholder-slate-500 focus:ring-purple-500/40 focus:border-purple-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]'
                      }`}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                        isDarkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-purple-900/40 hover:text-purple-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-[#7c3aed]'
                      }`}
                    >
                      {t("Cancel", "إلغاء")}
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || (!feedbackText.trim() && rating === 0)}
                      className={`px-6 py-2.5 text-sm font-semibold rounded-xl text-white shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                        isSubmitting || (!feedbackText.trim() && rating === 0)
                          ? 'bg-slate-400/50 cursor-not-allowed opacity-60'
                          : isDarkMode
                          ? 'bg-[#7c3aed] hover:bg-[#060a12] active:scale-[0.98] border border-purple-500/30'
                          : 'bg-[#060a12] hover:bg-[#7c3aed] active:scale-[0.98]'
                      }`}
                    >
                      <Send className="w-4 h-4 stroke-[2]" />
                      <span>{isSubmitting ? t("Submitting...", "جاري الإرسال...") : t("Submit Feedback", "إرسال الملاحظات")}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Thank You Confirmation Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 px-4 space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/15 text-[#7c3aed] dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-2xl font-extrabold tracking-tight">
                    {t("Thank You!", "شكراً لك!")}
                  </h3>
                  <p className={`text-sm max-w-sm mx-auto leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {t(
                      "Your feedback has been submitted successfully. We appreciate your response to help us continuously improve DGE GeoVision GIS.",
                      "تم إرسال ملاحظاتك بنجاح. نحن نقدر مشاركتك لمساعدتنا في تحسين DGE GeoVision GIS بشكل مستمر."
                    )}
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleClose}
                    className={`px-8 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer ${
                      isDarkMode
                        ? 'bg-[#7c3aed] hover:bg-[#060a12] border border-purple-500/30'
                        : 'bg-[#060a12] hover:bg-[#7c3aed]'
                    }`}
                  >
                    {t("Close", "إغلاق")}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
