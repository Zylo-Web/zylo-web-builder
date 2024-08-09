"use server";

import { clerkClient, currentUser, User } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";

export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) {
    return;
  }
  const userData = await db.user.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  });
  return userData;
};

export const saveActivityLogNotification = async ({
  agencyId,
  description,
  subaccoutId,
}: {
  agencyId?: string;
  description: string;
  subaccoutId?: string;
}) => {
  const authUser = await currentUser();
  let userData;
  if (!authUser) {
    const response = await db.user.findFirst({
      where: { Agency: { SubAccount: { some: { id: subaccoutId } } } },
    });
    if (response) {
      userData = response;
    } else {
      userData = await db.user.findUnique({
        where: { email: authUser?.emailAddresses[0].emailAddress },
      });
    }
    if (!userData) {
      console.log("Could not find a User");
      return;
    }

    let foundAgencyId = agencyId;
    if (!foundAgencyId) {
      throw new Error(
        "You need to provide at least an agency Id or subaccount Id"
      );
    }
    const response = await db.subAccount.findUnique({
      where: { id: subaccoutId },
    });
    if (response) {
      foundAgencyId = response.agencyId;
    }
  }
  if (subaccoutId) {
    await db.notification.create({
      data: {
        notification: `${userData?.name} | ${description}`,
        User: {
          connect: {
            id: userData?.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        SubAccount: {
          connect: {
            id: subaccoutId,
          },
        },
      },
    });
  } else {
    await db.notification.create({
      data: {
        notification: `${userData?.name} | ${description}`,
        User: {
          connect: {
            id: userData?.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    });
  }
};

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return null;
  const response = await db.user.create({ data: { ...user } });
  return response;
};

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");
  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });
  if (invitationExists) {
    const userDetails = await createTeamUser(invitationExists.agencyId, {
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.imageUrl,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExists.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await saveActivityLogNotification({
      agencyId: invitationExists?.agencyId,
      description: `Joined`,
      subaccoutId: undefined,
    });

    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || "SUBACCOUNT_USER",
        },
      });
      await db.invitation.delete({
        where: { email: userDetails.email },
      });
      return userDetails.agencyId;
    } else return null;
  } else {
    const agency = await await db.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    });
    return agency?agency.agencyId:null
  }
};
