"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import { User } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { LoadingPage } from "@/components/ui/loading";

export default function ProfileClient() {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ✅ Load user data safely
  useEffect(() => {
    if (user?.user) {
      setProfileData({
        name: user.user.name || "",
        email: user.user.email || "",
      });
    }
  }, [user]);

  // ---------------- PROFILE ----------------

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

 const handleProfileSubmit = async (e) => {
  e.preventDefault();

  if (!profileData.name.trim()) {
    toast.error("Name is required");
    return;
  }

  if (profileData.name === user?.user?.name) {
    toast.info("No changes detected");
    return;
  }

  try {
    setLoading(true);

    const res = await api.post(
      "/update-profile",
      {
        name: profileData.name.trim(), // ✅ body
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // ✅ header
        },
      }
    );

    if (res.status === 200) {
      toast.success("Profile updated successfully!");

      updateUser({ name: profileData.name.trim() });
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to update profile"
    );
  } finally {
    setLoading(false);
  }
};

  // ---------------- PASSWORD ----------------

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      return toast.error("Current password required");
    }

    if (passwordData.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New password and confirmation do not match");
    }
    if(passwordData.newPassword === passwordData.currentPassword) {
      return toast.error("New password cannot be the same as current password");
    }

    try {
      setPasswordLoading(true);

      const res = await api.post("/user/change-password", {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword,
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (res.status === 200) {
        toast.success("Password changed successfully!");

        // ✅ reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // ---------------- UI ----------------

  if (!user) {
    return <div><LoadingPage /></div>;
  }

  return (
   <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <DashboardBreadcrumb 
            items={[
              {
                label: 'Profile',
                icon: <User className="h-4 w-4" />
              }
            ]} 
          />
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Profile Settings</h1>
            <p className="text-slate-600 text-lg mt-2">Manage your account information</p>
          </div>
          
          <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-white border-2 border-purple-100 rounded-full p-1">
              <TabsTrigger value="profile" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">Profile Information</TabsTrigger>
              <TabsTrigger value="password" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">Change Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="border-2 border-purple-100 shadow-lg bg-white mt-6">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4 py-2">
                    <div className="">
                      <div>
                        <Label htmlFor="name">First Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        disabled
                      />
                    </div>
                    
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                     {loading? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                     {passwordLoading ? "Changing..." : "Change Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}