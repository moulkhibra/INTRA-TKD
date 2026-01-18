# 🌐 Portal System - Quick Reference Guide

## 🚀 Quick Start

### Access Points
```
Admin Dashboard:     http://localhost:3000
Portal Login:        http://localhost:3000/portal/login
Parent Portal:       http://localhost:3000/portal/parent
Student Portal:      http://localhost:3000/portal/student
```

### Navigation Buttons (Admin Header)
```
بورتال        → Opens /portal/login in new tab
إدارة الآباء  → Opens Parents Management tab
```

---

## 👥 User Types & Access

### **Admin User**
```
Entry: /login (main app)
Access: 
  - All admin features
  - Parent management tab
  - Portal launch button
  - View all data
```

### **Parent User**
```
Entry: /portal/login (select "Parent")
Access:
  - View linked children
  - Monitor attendance
  - Track payments
  - View statistics
  - Child information
```

### **Student User**
```
Entry: /portal/login (select "Student")
Access:
  - Personal dashboard
  - Attendance history
  - Achievement badges
  - QR code for check-in
  - Belt progression
```

---

## 🔐 Login Credentials Format

### Admin Login (Main App)
```json
{
  "email": "admin@tkd.com",
  "password": "secure_password"
}
```

### Parent Portal Login
```json
{
  "type": "parent",
  "email": "parent@example.com",
  "password": "parent_password"
}
```

### Student Portal Login
```json
{
  "type": "student",
  "email": "student@example.com",
  "password": "student_password"
}
```

---

## 📊 Portal Features Matrix

| Feature | Admin | Parent | Student |
|---------|-------|--------|---------|
| View Dashboard | ✅ | ✅ | ✅ |
| Manage Parents | ✅ | ❌ | ❌ |
| Link Students | ✅ | ❌ | ❌ |
| View Children | ❌ | ✅ | ❌ |
| View Attendance | ✅ | ✅ | ✅ |
| View Stats | ✅ | ✅ | ✅ |
| QR Check-in | ❌ | ❌ | ✅ |
| View Payments | ✅ | ✅ | ❌ |

---

## 🗂️ File Locations

### Components
```
src/components/
├── ProtectedRoute.js          (Portal guard)
├── NetworkStatus.js           (Online indicator)
└── QRScanner.js              (QR attendance)
```

### Views
```
src/views/
├── PortalLoginView.js         (Login page)
├── ParentPortalView.js        (Parent dashboard)
├── StudentPortalView.js       (Student dashboard)
├── ParentsPortal.js           (Internal parent view)
└── ParentsManagementView.js   (Admin management)
```

### APIs
```
src/api/
├── parents.js                 (Parent CRUD)
├── students.js                (Student data)
├── attendance.api.js          (Attendance)
└── payments.api.js            (Payment data)
```

---

## 🔄 Common Workflows

### Adding a Parent (Admin)
```
1. Click "Parents Management" tab
2. Click "Add New Parent"
3. Fill in: Name, Email, Phone, Password
4. Click "Save"
5. Go to "Link Students" to connect children
```

### Parent Viewing Child Info
```
1. Go to /portal/login
2. Select "Parent"
3. Enter email & password
4. View children list
5. Click on child to see attendance
6. View statistics & charts
```

### Student Checking In
```
1. Go to /portal/login
2. Select "Student"
3. Enter email & password
4. Click "Display QR Code"
5. Show code to scanner
6. Attendance recorded
```

---

## 🛠️ API Endpoints Quick Reference

### Parents
```javascript
// List all
getAllParents()

// Get specific
getParentByEmail('email@example.com')
getParentById('parentId')

// Manage
addParent(data)
updateParent(id, data)
deleteParent(id)

// Relations
getParentChildren(parentId)
linkStudentToParent(studentId, parentId)
```

### Attendance
```javascript
getStudentAttendance(studentId)
addAttendance(data)
updateAttendance(id, data)
```

### Payments
```javascript
getStudentPayments(studentId)
getPayments()
```

---

## 📱 Mobile Tips

### Best Viewed On
- Portrait mode (phone)
- Landscape mode (tablet)
- Any desktop size

### Responsive Breakpoints
```
Mobile:    < 640px
Tablet:    640px - 1024px
Desktop:   > 1024px
```

### Touch-Friendly
- Large buttons (min 44px)
- Clear spacing
- Easy navigation
- Auto-complete forms

---

## 🎨 UI Color Scheme

### Brand Colors
```
Primary:    Red (#DC143C, #B71C1C)
Secondary:  Orange (#FF6B35)
Success:    Green (#32CD32)
Warning:    Yellow (#FFD700)
Error:      Red (#DC143C)
Background: Light gray (#F3F4F6)
```

### Text Colors
```
Headers:    Dark gray (#1F2937)
Body:       Medium gray (#4B5563)
Secondary:  Light gray (#9CA3AF)
```

---

## ⌨️ Keyboard Shortcuts

```
Tab              → Navigate between inputs
Enter            → Submit form
Escape           → Close modal
Ctrl/Cmd + S     → Auto-save (if enabled)
```

---

## 🐛 Quick Troubleshooting

### "Can't login"
```
✓ Clear browser cache
✓ Verify email exists
✓ Check password
✓ Try incognito mode
```

### "No children shown"
```
✓ Check parent-student links in admin
✓ Verify parentId field in students
✓ Refresh page (F5)
```

### "Charts not displaying"
```
✓ Check data exists
✓ Verify Recharts installed
✓ Check browser console errors
✓ Try different browser
```

### "Mobile looks broken"
```
✓ Try portrait orientation
✓ Zoom out if needed
✓ Clear localStorage
✓ Hard refresh (Ctrl+Shift+R)
```

---

## 💾 Data Backup

### localStorage Key
```
'portalUser'  → Active portal session
```

### To Clear Portal Session
```javascript
localStorage.removeItem('portalUser')
// Forces re-login
```

### To Check Current User
```javascript
const user = JSON.parse(localStorage.getItem('portalUser'))
console.log(user)
```

---

## 🔗 External Links

### Documentation
- `PORTAL_SYSTEM_IMPLEMENTATION.md` - Full implementation guide
- `PORTAL_SYSTEM_STATUS.md` - Status report
- `PARENTS_PORTAL.md` - Arabic user guide

### Firebase
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com)

### React
- [React Router v6 Docs](https://reactrouter.com)
- [React Hooks Documentation](https://react.dev/reference/react)

---

## 📞 Support Matrix

| Issue | Solution | Location |
|-------|----------|----------|
| Login fails | Check credentials | `/portal/login` |
| No data shows | Refresh page | Browser F5 |
| Mobile broken | Rotate phone | Portrait mode |
| Links missing | Check admin auth | Admin dashboard |
| Performance slow | Clear cache | Browser settings |

---

## ✅ Checklist Before Going Live

- [ ] Test all login scenarios
- [ ] Verify data loads correctly
- [ ] Check mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Verify Firebase rules
- [ ] Set up backups
- [ ] Document admin procedures
- [ ] Train staff users
- [ ] Create user guides
- [ ] Set up monitoring

---

## 🎯 Key Metrics to Monitor

```
Performance:
  ├─ Load time (target: < 2s)
  ├─ API response time (target: < 500ms)
  └─ User session time (target: > 10min)

Usage:
  ├─ Daily active users
  ├─ Feature adoption rate
  └─ Support ticket count

Errors:
  ├─ JavaScript errors
  ├─ API failures
  └─ Firebase quota usage
```

---

## 🚀 Deployment Checklist

```bash
# Before deployment
npm run build          # Build for production
npm test              # Run all tests
npm run lint          # Check code quality

# Verify
✓ No console errors
✓ All routes working
✓ Mobile tested
✓ Performance checked
✓ Security reviewed
```

---

## 📚 Related Documentation

1. **Implementation Guide** - `PORTAL_SYSTEM_IMPLEMENTATION.md`
2. **Status Report** - `PORTAL_SYSTEM_STATUS.md`
3. **Arabic Guide** - `PARENTS_PORTAL.md`
4. **This File** - Quick Reference (you are here)

---

## 🎓 Learning Resources

### Setup & Configuration
- Firebase setup guide
- React Router tutorial
- Tailwind CSS documentation
- Recharts example gallery

### Best Practices
- React component patterns
- Security best practices
- Performance optimization
- Accessibility guidelines

### Troubleshooting
- Browser DevTools guide
- Firebase Firestore debugging
- React DevTools setup
- Network tab analysis

---

**Last Updated:** 12 January 2026

**Version:** 1.0.0

**Status:** ✅ Active & Maintained
